import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from "@mui/material/Button";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch();

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all'
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))

    if (!data.payload) {
      return alert("Не удалось авторизоваться")
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if (isAuth) {
    return <Navigate to={"/"} />
  }

  return (
    <section className="login">
      <section className="register__section">
        <div className='section__body -loginpage'>
          <h1>Вхід</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              className='form__field -loginpage'
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
              Авторизуватись
            </Button>
          </form>
        </div>
      </section>
    </section>
  );
};