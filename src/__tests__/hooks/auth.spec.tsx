import { renderHook, act }  from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../../hooks/auth';
import MockAdatper from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdatper(api);


describe('Auth Hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'user',
        email: 'user@email.com',
      },
      token: 'token123',
    };


    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'user@email.com',
      password: '123456',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user)
    );
    expect(result.current.user.email).toEqual('user@email.com');
  });

  it('should restore saved data from storage when auth inits', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'user',
            email: 'user@email.com',
          });
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('user@email.com');
  });

  it('should be able to signOut', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'token123';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'user',
            email: 'user@email.com',
          });
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    act(() => {
      result.current.signOut();
    })
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });


  it('should be able to update data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'user',
      email: 'user@email.com',
      avatar_url: 'ddd.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    })

    expect(setItemSpy).toBeCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);

  });

});