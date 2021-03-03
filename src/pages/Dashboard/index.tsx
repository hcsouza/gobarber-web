import React from 'react';

import { Container, Header, HeaderContent, Profile, Content, Schedule, NextAppointment, Calendar } from './styles';

import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () =>  {
  const { signOut, user } =  useAuth();
  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="GoBarber" />

          <Profile>
            <img src={user.avatar_url}
            alt={user.name} />
            <div>
              <span>Bem-vindo,</span>
              <strong>{user.name}</strong>
            </div>
          </Profile>
          <button type='button' onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Horários Agendados</h1>
          <p>
            <span>Hoje</span>
            <span>Dia 06</span>
            <span>Segunda-feira</span>
          </p>
          <NextAppointment>
            <strong>Atendimento a seguir</strong>
            <div>
              <img src="https://avatars.githubusercontent.com/u/384398?s=460&u=07daf30d96adf7f0c763345a806d10d5b612cf15&v=4" alt="foto" />
              <strong>Hugo Souza</strong>
              <span>
                <FiClock />
                09:16
              </span>
            </div>
          </NextAppointment>
        </Schedule>
        <Calendar />
      </Content>

    </Container>
  );
}

export default Dashboard;