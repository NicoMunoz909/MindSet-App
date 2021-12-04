import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './interviews.module.css';
import CreateButton from './CreateButton';
import EditButton from './EditButton';
import RemoveButton from './RemoveButton';
import RemoveModal from './RemoveModal';
import Modal from './Modal';

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(undefined);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/interviews`)
      .then((response) => response.json())
      .then((response) => {
        setInterviews(response.data);
      })
      .catch((error) => error);
  }, []);

  const handleDelete = (event, interview) => {
    event.stopPropagation();
    setSelectedInterview(interview._id);
  };

  const closeRemoveModal = () => {
    setShowRemoveModal(false);
  };

  const closeModalSuccess = () => {
    setShowSuccessDelete(false);
    window.location.href = '/interviews';
  };

  const confirmRemoveModal = () => {
    const url = `${process.env.REACT_APP_API}/interviews/${selectedInterview}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then((response) => {
        if (response.status !== 204) {
          return response.json().then(({ message }) => {
            throw new Error(message);
          });
        }
      })
      .then(() => {
        setShowRemoveModal(false);
        setShowSuccessDelete(true);
      })
      .catch((error) => error);
  };

  return (
    <div className={styles.container}>
      <Modal
        show={showSuccessDelete}
        title="Successful"
        message={'Interview deleted'}
        onCancel={closeModalSuccess}
      />
      <h1>Interviews</h1>
      <ul className={styles.list1}>
        <li>Postulant</li>
        <li>Client</li>
      </ul>
      <ul className={styles.list2}>
        <li>First Name</li>
        <li>Last Name</li>
        <li>Name</li>
        <li>ID</li>
        <li>Status</li>
        <li>Date</li>
        <li>Notes</li>
        <li>Actions</li>
      </ul>
      {interviews.map((interview) => {
        return (
          <ul className={styles.list} key={interview._id}>
            <li>{interview.postulant.firstName}</li>
            <li>{interview.postulant.lastName}</li>
            <li>{interview.client.name}</li>
            <li>{interview.application.result}</li>
            <li>{interview.status}</li>
            <li>{interview.date.replace('T00:00:00.000Z', '')}</li>
            <li>{interview.notes}</li>
            <li className={styles.buttons}>
              <Link to={`interviews/form?id=${interview._id}`}>
                <EditButton />
              </Link>
            </li>
            <li className={styles.buttons}>
              <RemoveButton
                onClick={(event) => {
                  handleDelete(event, interview);
                  setShowRemoveModal(true);
                }}
              />
            </li>
          </ul>
        );
      })}
      <RemoveModal
        show={showRemoveModal}
        confirmRemoveModal={confirmRemoveModal}
        closeRemoveModal={closeRemoveModal}
      />
      {/* <CreateForm show={showCreateForm} closeCreateForm={closeCreateForm} /> */}
      <Link to="interviews/form">
        <CreateButton />
      </Link>
    </div>
  );
}

export default Interviews;
