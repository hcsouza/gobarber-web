import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Container, Content, AvatarInput } from './styles';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history  = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback( async (data: ProfileFormData) =>  {
    try {

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório'),
        email: Yup.string().required('E-mail é obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }).oneOf([Yup.ref('password'), null],'Confirmação incorreta',),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      const { name, email, old_password, password,  password_confirmation} = data;

      const formData =  {
        name,
        email,
        ...(old_password
        ? {
          old_password,
          password,
          password_confirmation,
        }
        : {}),
      }

      const response = await api.put('/profile', formData);
      updateUser(response.data);

      history.push('/dashboard');

      addToast({
        type: 'success',
        title: 'Perfil atualizado.',
        description: 'Seus dados de perfil foram atualizados com sucesso!',
      })

    } catch (err) {
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        type: 'error',
        title: 'Erro no Cadastro',
        description: 'Ocorreu um erro ao atualizar seu perfil.'
      });
    }

  }, [addToast, history, updateUser]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
      const data = new FormData();
      data.append('avatar', e.target.files[0]);
      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado!',
          description: 'Avatar atualizado com sucesso!',
        });
      })

    }
  }, [addToast, updateUser]);

  return (
    <>
      <Container>
        <header>
          <div>
            <Link to="/dashboard" >
              <FiArrowLeft />
            </Link>
          </div>
        </header>
        <Content>
            <Form ref={formRef} initialData={{
              name: user.name,
              email: user.email,
            }}

            onSubmit={handleSubmit}>
              <AvatarInput>
                <img src={user.avatar_url} alt={user.name} />
                <label htmlFor="avatar">
                  <FiCamera />
                  <input type="file" name="" id="avatar" onChange={handleAvatarChange} />
                </label>

              </AvatarInput>
              <h1>Meu Perfil</h1>
              <Input name="name" icon={FiUser} type="text" placeholder="Nome" />
              <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />
              <Input containerStyle={{ marginTop: 24 }} name="old_password" icon={FiLock} type="password" placeholder="Senha atual" />
              <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha" />
              <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar Nova Senha" />

              <Button type="submit" name="Login">Confirmar Mudanças</Button>
            </Form>
        </Content>
      </Container>
    </>
  )
};

export default Profile;