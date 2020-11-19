import { useState } from 'react';
import Layout from '../../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../../config';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Links = ({ token, links, totalLinks, linksLimit, linkSkip }) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalLinks);

    const confirmDelete = (e, id) => {
        e.preventDefault();
        // console.log('delete > ', slug);
        let answer = window.confirm('Are you sure you want to delete?');
        if (answer) {
            handleDelete(id);
        }
    };

    const handleDelete = async id => {
        try {
            const response = await axios.delete(`${API}/link/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('LINK DELETE SUCCESS ', response);
            process.browser && window.location.reload();
        } catch (error) {
            console.log('LINK DELETE ', error);
        }
    };

    const listOfLinks = () =>
        allLinks.map((l, i) => (
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" onClick={e => handleClick(l._id)}>
                    <a href={l.url} target="_blank">
                        <h5 className="pt-2">{l.title}</h5>
                        <h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
                            {l.url}
                        </h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                    <br />
                    <span className="badge text-secondary pull-right">{l.clicks} clicks</span>
                </div>

                <div className="col-md-12">
                    <span className="badge text-dark">
                        {l.type} / {l.medium}
                    </span>
                    {l.categories.map((c, i) => (
                        <span key={i} className="badge text-success">
                            {c.name}
                        </span>
                    ))}

                    <span onClick={e => confirmDelete(e, l._id)} className="badge text-danger pull-right">
                        Delete
                    </span>
                    <Link href={`/user/link/${l._id}`}>
                        <a>
                            <span className="badge text-warning pull-right">Update</span>
                        </a>
                    </Link>
                </div>
            </div>
        ));

    const loadMore = async () => {
        let toSkip = skip + limit;

        const response = await axios.post(
            `${API}/links`,
            { skip: toSkip, limit },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setAllLinks([...allLinks, ...response.data]);
        // console.log('allLinks', allLinks);
        // console.log('response.data.links.length', response.data.links.length);
        setSize(response.data.length);
        setSkip(toSkip);
    };

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="display-4 font-weight-bold">All Links</h1>
                </div>
            </div>
            <br />

            <InfiniteScroll
                pageStart={0}
                loadMore={loadMore}
                hasMore={size > 0 && size >= limit}
                loader={<img key={0} src="/static/images/loading.gif" alt="loading" />}
            >
                <div className="row">
                    <div className="col-md-12">{listOfLinks()}</div>
                </div>
            </InfiniteScroll>
        </Layout>
    );
};

Links.getInitialProps = async ({ req }) => {
    let skip = 0;
    let limit = 2;

    const token = getCookie('token', req);

    const response = await axios.post(
        `${API}/links`,
        { skip, limit },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return {
        links: response.data,
        totalLinks: response.data.length,
        linksLimit: limit,
        linkSkip: skip,
        token
    };
};

export default withAdmin(Links);
