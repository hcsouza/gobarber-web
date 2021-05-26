import React, {useCallback, useRef, useState } from 'react';
import { Container, Content, AnimationContainer, Background } from './styles';
import { Link, useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';

import { FiLogIn, FiMail } from 'react-icons/fi';
import logo from '../../assets/logo.svg'
import Button from '../../components/Button';
import Input from '../../components/Input';
import api from '../../services/api';



interface ForgotPasswordFormData{
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback( async (data: ForgotPasswordFormData) =>  {
    try {
      setLoading(true);

      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório').email('Digite um e-mail válido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });
      //history.push('/dashboard');

      await api.post('/password/forgot', {
        email: data.email,
      });

      addToast({
        type: 'success',
        title: 'E-mail de recuperação de senha enviado.',
        description: 'Enviamos um e-mail com as instruções de recuperação de senha',
      });


    } catch (err) {
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na recuperação',
        description: 'Ocorreu um erro ao recuperar senha'
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logo} alt="Logotipo GoBarber" />
            <Form ref={formRef} onSubmit={ handleSubmit } >
              <h1>Recuperar Senha</h1>
              <Input name="email" icon={FiMail} type="text" placeholder="E-mail" />

              <Button loading={loading} name="Login" type="submit">Recuperar</Button>

            </Form>
            <Link to='/' >
              <FiLogIn />
              Voltar ao Login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
}

export default ForgotPassword;