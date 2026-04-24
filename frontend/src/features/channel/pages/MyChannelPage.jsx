import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyChannel } from '../state/channelSlice';
import { useNavigate } from 'react-router-dom';
import CreateChannelForm from '../components/CreateChannelForm';
import './MyChannelPage.css';

const MyChannelPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myChannel, loading } = useSelector((state) => state.channel);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyChannel());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (myChannel) {
      navigate(`/channel/${myChannel.handle}`);
    }
  }, [myChannel, navigate]);

  if (loading) return (
    <div className="loading-state">
      <div className="loader"></div>
      <p>Synchronizing with the Grid...</p>
    </div>
  );

  if (!myChannel) {
    return <CreateChannelForm />;
  }

  return null;
};

export default MyChannelPage;
