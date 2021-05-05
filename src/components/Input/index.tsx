import React, { InputHTMLAttributes, useEffect, useRef, useState, useCallback } from 'react';
import { Container, Error } from './styles';
import { IconBaseProps } from 'react-icons/lib/cjs';
import { FiAlertCircle } from 'react-icons/fi';
import { useField } from '@unform/core';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
};

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled]   = useState(false);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current?.value);
  }, []);

  const handleFocus = useCallback(()=>{
    setIsFocused(true);
  },[]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
      data-testid="input-container"
    >
      { Icon && <Icon size={20} /> }
      <input
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultValue={defaultValue} ref={inputRef} {...rest} />

      {error &&
        <Error title={error}>
          <FiAlertCircle color="C53030" size={20} />
        </Error>
      }
    </Container>
  );
};

export default Input;