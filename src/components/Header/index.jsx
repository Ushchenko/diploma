import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm("Вийти з акаунту?")) {
      dispatch(logout());
      window.localStorage.removeItem('token')
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Container maxWidth="lg">
          <div className={styles.inner}>
            <Link className={styles.logo} to="/">
              <div>Book Online</div>
            </Link>
            <div className={styles.buttons}>
              {isAuth ? (
                <>
                  <Button onClick={onClickLogout} variant="contained" color="error">
                    Вийти
                  </Button>
                  <Link to="/books/favourite">
                    <Button variant="contained">
                      Улюблені
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outlined">Ввійти</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="contained">Створити акаунт</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  )
};