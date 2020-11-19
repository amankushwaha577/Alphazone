import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, logout } from '../helpers/auth';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Layout = ({ children }) => {
    const head = () => (
        <React.Fragment>
            <link
                rel="stylesheet"
                href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous"
            />
            <link rel="stylesheet" href="/static/css/styles.css" />
            <script src="https://kit.fontawesome.com/a076d05399.js"></script>
        </React.Fragment>
    );

    const nav = () => (
        <ul className="nav nav-tabs text-primary bg-dark">
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link"><i class="fas fa-home"></i>Home</a>
                </Link>
            </li>

            <li className="nav-item">
                <Link href="/user/link/create">
                    <a className="nav-link btn btn-success" style={{ borderRadius: '0px' }}>
                    <i class="fas fa-upload"></i>
                        Submit a link
                    </a>
                </Link>
            </li>

            {!isAuth() && (
                <React.Fragment>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link"><i class="fas fa-sign-in-alt"></i>Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/register">
                            <a className="nav-link"><i class="fas fa-user-plus"></i>Register</a>
                        </Link>
                    </li>
                </React.Fragment>
            )}

            {isAuth() && isAuth().role === 'admin' && (
                <li className="nav-item ml-auto">
                    <Link href="/admin">
                        <a className="nav-link"><i class="fas fa-user"></i>{isAuth().name}</a>
                    </Link>
                </li>
            )}

            {isAuth() && isAuth().role === 'subscriber' && (
                <li className="nav-item ml-auto">
                    <Link href="/user">
                        <a className="nav-link"><i class="fas fa-user"></i>{isAuth().name}</a>
                    </Link>
                </li>
            )}

            {isAuth() && (
                <li className="nav-item">
                    <a onClick={logout} className="nav-link">
                    <i class="fas fa-sign-out-alt"></i>Logout
                    </a>
                </li>
            )}

            
        </ul>
    );

    return (
        <React.Fragment>
            {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
        </React.Fragment>
    );
};

export default Layout;
