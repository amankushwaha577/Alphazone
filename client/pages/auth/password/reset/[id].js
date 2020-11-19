import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Router, { withRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Layout from '../../../../components/Layout';

const ResetPassword = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Reset Password',
        success: '',
        error: ''
    });
    const { name, token, newPassword, buttonText, success, error } = state;

    useEffect(() => {
        console.log(router);
        const decoded = jwt.decode(router.query.id);
        if (decoded) setState({ ...state, name: decoded.name, token: router.query.id });
    }, [router]);

    const handleChange = e => {
        setState({ ...state, newPassword: e.target.value, success: '', error: '' });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        // console.log('post email to ', email);
        setState({ ...state, buttonText: 'Sending' });
        try {
            const response = await axios.put(`${API}/reset-password`, { resetPasswordLink: token, newPassword });
            // console.log('FORGOT PASSWORD', response);
            setState({
                ...state,
                newPassword: '',
                buttonText: 'Done',
                success: response.data.message
            });
        } catch (error) {
            console.log('RESET PW ERROR', error);
            setState({
                ...state,
                buttonText: 'Forgot Password',
                error: error.response.data.error
            });
        }
    };

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input
                    type="password"
                    className="form-control"
                    onChange={handleChange}
                    value={newPassword}
                    placeholder="Type new password"
                    required
                />
            </div>
            <div>
                <button className="btn btn-outline-warning">{buttonText}</button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Hi {name}, Ready to Reset Password?</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {passwordResetForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ResetPassword);
