import styles from './postulants.module.css';
import { useEffect, useState } from 'react';
import Items from './Items.jsx';
import FormUpdate from './Form-Update.jsx';

function Postulants() {
  const [postulants, setPostulants] = useState([]);
  const [formId, setFormId] = useState(false);
  /*   const params = new URLSearchParams(window.location.search); */
  /*   let id = params.get('id'); */
  const url = `${process.env.REACT_APP_API}/postulants`;
  const getPostulants = async () => {
    const responseRaw = await fetch(url);
    const responseJson = await responseRaw.json();
    return responseJson.data;
  };
  const body = {
    contactRange: {
      from: '',
      to: ''
    },
    studies: {
      primaryStudies: {
        startDate: '',
        endDate: '',
        school: ''
      },
      secondaryStudies: {
        startDate: '',
        endDate: '',
        school: ''
      },
      tertiaryStudies: [
        {
          startDate: '',
          endDate: '',
          description: '',
          institute: ''
        }
      ],
      universityStudies: [
        {
          startDate: '',
          description: '',
          institute: ''
        },
        {
          startDate: '',
          endDate: '',
          description: '',
          institute: ''
        }
      ],
      informalStudies: [
        {
          startDate: '',
          endDate: '',
          description: '',
          institute: ''
        }
      ]
    },
    _id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    birthday: '',
    available: true,
    phone: '',
    profiles: [
      {
        profileId: '',
        name: ''
      }
    ],
    workExperience: [
      {
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      },
      {
        company: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ],
    createdAt: '',
    updatedAt: ''
  };
  const usePostulants = async () => {
    const formPostulants = await getPostulants();
    setPostulants(formPostulants);
  };
  useEffect(() => {
    usePostulants();
  }, []);

  if (formId && postulants[0]) {
    return (
      <FormUpdate
        postulant={postulants.find((postulant) => postulant._id === formId)}
        id={formId}
        template={body}
      />
    );
  }
  return (
    <section className={styles.container}>
      <h2>Postulants</h2>
      <Items
        url={url}
        postulants={postulants.map((postulant) => {
          return (postulant = {
            _id: postulant._id,
            firstName: postulant.firstName,
            lastName: postulant.lastName,
            email: postulant.email,
            phone: postulant.phone,
            available: postulant.available
          });
        })}
        setFormId={setFormId}
        fetchData={usePostulants} // lo que va a hacer el boton "ok" del modal
      />
      <div>
        <button
          onClick={() => (window.location.href = `${window.location.origin}/postulants-form`)}
        >
          Add
        </button>
      </div>
    </section>
  );
}

export default Postulants;
