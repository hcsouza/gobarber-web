import React, {useCallback, useRef } from 'react';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import { FiLogIn, FiLock } from 'react-icons/fi';
import logo from '../../assets/logo.svg'
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';

interface ResetPasswordFormData{
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = useCallback( async (data: ResetPasswordFormData) =>  {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('O campo senha é obrigatório'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'As senhas devem coincidir.'),
      });

      const token = location.search.replace('?token=', '');
      if (!token) {
        throw new Error();
      }

      await schema.validate(data, {
        abortEarly: false,
      });

      api.post('/password/reset', {
        password: data.password,
        password_confirmation: data.password_confirmation,
        token: token,
      });

      history.push('/');

    } catch (err) {
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na redefinição de senha',
        description: 'Erro na redefinição de senha.'
      });
    }
  }, [addToast, history, location.search]);

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logo} alt="Logotipo GoBarber" />
            <Form ref={formRef} onSubmit={ handleSubmit } >
              <h1>Resetar Senha</h1>
              <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
              <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar Senha" />
              <Button name="Reset" type="submit">Entrar</Button>
            </Form>
            <Link to='/' >
              <FiLogIn />
              Entrar
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
}

export default ResetPassword;