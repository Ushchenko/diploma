import './Register.scss'

import React from 'react';
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth)


  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      login: '',
      email: '',
      password: '',
    },
    mode: 'all'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values))

    if (!data.payload) {
      return alert("Не удалось зарегистрироватся")
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to={"/"} />
  }

  return (
    <section className="register">
      <section className="register__section">
        <div className='section__body'>
          <h1>Реєстрація</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              error={Boolean(errors.login?.message)}
              helperText={errors.login?.message}
              className='form__field'
              {...register('login', { required: "Вкажіть логін" })}
              label="Логін"
              autoComplete="off"
              fullWidth
            />
            <TextField
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message}
              {...register('email', { required: "Вкажіть почту" })}
              className='form__field'
              label="E-Mail"
              autoComplete="off"
              fullWidth
            />
            <TextField
              error={Boolean(errors.password?.message)}
              helperText={errors.password?.message}
              {...register('password', { required: "Вкажіть пароль" })}
              className='form__field'
              type={showPassword ? "text" : "password"}
              label="Пароль"
              autoComplete="off"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
              Зареєструватися
            </Button>
          </form>
        </div>
      </section>
    </section>
  )
}