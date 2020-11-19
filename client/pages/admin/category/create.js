import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import 'react-quill/dist/quill.bubble.css';

const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        buttonText: 'Create',
        image: ''
    });
    const [content, setContent] = useState('');
    const [imageUploadButtonName, setImageUploadButtonName] = useState('Upload image');

    const { name, success, error, image, buttonText, imageUploadText } = state;

    const handleChange = name => e => {
        setState({ ...state, [name]: e.target.value, error: '', success: '' });
    };

    const handleContent = e => {
        console.log(e);
        setContent(e);
        setState({ ...state, success: '', error: '' });
    };

    const handleImage = event => {
        let fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        setImageUploadButtonName(event.target.files[0].name);
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                300,
                300,
                'JPEG',
                100,
                0,
                uri => {
                    // console.log(uri);
                    setState({ ...state, image: uri, success: '', error: '' });
                },
                'base64'
            );
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({ ...state, buttonText: 'Creating' });
        console.table({ name, content, image });
        try {
            const response = await axios.post(
                `${API}/category`,
                { name, content, image },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log('CATEGORY CREATE RESPONSE', response);
            setImageUploadButtonName('Upload image');
            setContent('');
            setState({
                ...state,
                name: '',
                formData: '',
                buttonText: 'Created',
                imageUploadText: 'Upload image',
                success: `${response.data.name} is created`
            });
        } catch (error) {
            console.log('CATEGORY CREATE ERROR', error);
            setState({ ...state, buttonText: 'Create', error: error.response.data.error });
        }
    };

    const createCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <ReactQuill
                    value={content}
                    onChange={handleContent}
                    placeholder="Write something..."
                    theme="bubble"
                    className="pb-5 mb-3"
                    style={{ border: '1px solid #666' }}
                />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadButtonName}
                    <input onChange={handleImage} type="file" accept="image/*" className="form-control" hidden />
                </label>
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
                    <h1>Create category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withAdmin(Create);
