import styles from './form.module.css';
import Input from '../../Shared/Input';
import ButtonCancel from '../../Shared/Buttons/ButtonCancel';
import ButtonConfirm from '../../Shared/Buttons/ButtonConfirm';
import ModalError from '../../Shared/ModalError';
import Checkbox from '../../Shared/Checkbox';
import TextArea from '../../Shared/TextArea';
import Select from '../../Shared/Select';
import AddButton from '../../Shared/Buttons/ButtonLittleAdd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useQuery from '../../../Hooks/useQuery';
import {
  createPostulant,
  getPostulantById,
  updatePostulant
} from '../../../redux/Postulants/thunks';
import { closeErrorModal } from '../../../redux/Postulants/actions';

const Form = () => {
  const error = useSelector((store) => store.postulants.error);
  const isLoading = useSelector((store) => store.postulants.isLoading);
  const dispatch = useDispatch();
  const history = useHistory();
  const query = useQuery();
  const [id, setPostulantId] = useState(undefined);
  const [profiles, setProfiles] = useState([]);
  const [inputsCounter, setCounter] = useState({
    tertiaryStudies: 0,
    universityStudies: 0,
    informalStudies: 0,
    workExperience: 0
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    birthday: '',
    available: false
  });
  const [primaryStudies, setPrimaryStudies] = useState({
    startDate: '',
    endDate: '',
    school: ''
  });
  const [secondaryStudies, setSecondaryStudies] = useState({
    startDate: '',
    endDate: '',
    school: ''
  });
  const [tertiaryStudies, setTertiaryStudies] = useState([]);
  const [universityStudies, setUniversityStudies] = useState([]);
  const [informalStudies, setInformalStudies] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);

  useEffect(() => {
    const postulantId = query.get('_id');
    if (postulantId) {
      dispatch(getPostulantById(postulantId)).then((selectedPostulant) => {
        setPostulantId(postulantId);
        setPersonalInfo({
          firstName: selectedPostulant.firstName,
          lastName: selectedPostulant.lastName,
          email: selectedPostulant.email,
          password: selectedPostulant.password,
          address: selectedPostulant.address,
          phone: selectedPostulant.phone,
          birthday: selectedPostulant.birthday,
          available: selectedPostulant.available
        });
        setProfiles(selectedPostulant.profiles);
        setPrimaryStudies(selectedPostulant.studies.primaryStudies);
        setSecondaryStudies(selectedPostulant.studies.secondaryStudies);
        setTertiaryStudies(selectedPostulant.studies.tertiaryStudies);
        setUniversityStudies(selectedPostulant.studies.universityStudies);
        setInformalStudies(selectedPostulant.studies.informalStudies);
        setWorkExperience(selectedPostulant.workExperience);
        setCounter({
          tertiaryStudies: selectedPostulant.studies.tertiaryStudies.length,
          universityStudies: selectedPostulant.studies.universityStudies.length,
          informalStudies: selectedPostulant.studies.informalStudies.length,
          workExperience: selectedPostulant.workExperience.length
        });
      });
    }
  }, []);

  fetch(`${process.env.REACT_APP_API}/profiles`)
    .then((response) => {
      if (response.status !== 200 && response.status !== 201 && response.status !== 204) {
        const status = `${response.status} ${response.statusText}`;
        return response.json().then(({ message }) => {
          if (message.message) throw { message: message.message, status };
          throw { message, status };
        });
      }
      return response.json();
    })
    .then((response) => {
      setProfiles(response.data);
    })
    .catch((error) => error);

  const parseDate = (string) => {
    return string.split('T')[0];
  };

  const submitForm = (e) => {
    e.preventDefault();

    const postulantId = query.get('_id');
    if (postulantId) {
      dispatch(
        updatePostulant(postulantId, {
          ...personalInfo,
          studies: {
            primaryStudies,
            secondaryStudies,
            tertiaryStudies,
            universityStudies,
            informalStudies
          },
          workExperience
        })
      ).then((response) => {
        if (response) history.push('/postulants');
      });
    } else {
      dispatch(
        createPostulant({
          ...personalInfo,
          studies: {
            primaryStudies,
            secondaryStudies,
            tertiaryStudies,
            universityStudies,
            informalStudies
          },
          workExperience
        })
      ).then((response) => {
        if (response) history.push('/postulants');
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submitForm}>
        <div className={styles.header}>
          <h2 className={styles.title}>{id ? 'Update a Postulant' : 'Create a Postulant'}</h2>
        </div>
        <h3>Personal Info</h3>
        <div className={styles.fields}>
          <div className={styles.columns}>
            <Input
              label={'First Name'}
              name={'firstName'}
              placeholder={'First Name'}
              pattern="[A-Za-z ]*"
              required={true}
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
            />
            <Input
              label={'Email'}
              name={'email'}
              placeholder={'Email'}
              required={true}
              type={'email'}
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
            />
            <Input
              label={'Address'}
              name={'address'}
              placeholder={'Address'}
              required={true}
              value={personalInfo.address}
              onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
            />
            <Input
              label={'Birth Date'}
              name={'birthday'}
              type={'date'}
              required={true}
              value={parseDate(personalInfo.birthday)}
            />
            <Checkbox
              label={'Available?'}
              value={personalInfo.available}
              onChange={(e) => setPersonalInfo({ ...personalInfo, available: e.target.checked })}
            />
          </div>
          <div className={styles.columns}>
            <Input
              label={'Last Name'}
              name={'lastName'}
              placeholder={'Last Name'}
              pattern="[A-Za-z ]*"
              required={true}
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
            />
            <Input
              label={'Password'}
              name={'password'}
              placeholder={'Password'}
              required={true}
              type={'password'}
              value={personalInfo.password}
              onChange={(e) => setPersonalInfo({ ...personalInfo, password: e.target.value })}
            />
            <Input
              label={'Phone Number'}
              name={'phoneNumber'}
              placeholder={'+54113062939'}
              required={true}
              type={'tel'}
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phoneNumber: e.target.value })}
            />
            <Select label={'Profiles'} object={profiles} value={profiles[0]} />
          </div>
        </div>
        <h3>Primary Studies</h3>
        <div className={styles.fields}>
          <div className={styles.columns}>
            <Input
              label={'Start Date'}
              name={'startDate'}
              placeholder={'Start Date'}
              type={'date'}
              value={parseDate(primaryStudies.startDate)}
              onChange={(e) => setPrimaryStudies({ ...primaryStudies, startDate: e.target.value })}
            />
            <Input
              label={'School'}
              name={'school'}
              placeholder={'School'}
              type={'text'}
              value={primaryStudies.school}
              onChange={(e) => setPrimaryStudies({ ...primaryStudies, school: e.target.value })}
            />
          </div>
          <div className={styles.columns}>
            <Input
              label={'Finish Date'}
              name={'endDate'}
              placeholder={'Finish Date'}
              type={'date'}
              value={parseDate(primaryStudies.endDate)}
              onChange={(e) => setPrimaryStudies({ ...primaryStudies, endDate: e.target.value })}
            />
          </div>
        </div>
        <h3>Secondary Studies</h3>
        <div className={styles.fields}>
          <div className={styles.columns}>
            <Input
              label={'Start Date'}
              name={'startDate'}
              placeholder={'Start Date'}
              type={'date'}
              value={parseDate(secondaryStudies.startDate)}
              onChange={(e) =>
                setSecondaryStudies({ ...secondaryStudies, startDate: e.target.value })
              }
            />
            <Input
              label={'School'}
              name={'school'}
              placeholder={'School'}
              type={'text'}
              value={secondaryStudies.school}
              onChange={(e) => setSecondaryStudies({ ...secondaryStudies, school: e.target.value })}
            />
          </div>
          <div className={styles.columns}>
            <Input
              label={'Finish Date'}
              name={'endDate'}
              placeholder={'Finish Date'}
              type={'date'}
              value={parseDate(secondaryStudies.endDate)}
              onChange={(e) =>
                setSecondaryStudies({ ...secondaryStudies, endDate: e.target.value })
              }
            />
          </div>
        </div>
        <h3>Tertiary Studies</h3>
        {[...Array(inputsCounter.tertiaryStudies)].map((_, i) => (
          <div className={styles.fields} key={i}>
            <div className={styles.columns}>
              <Input
                label={'Start Date'}
                name={'startDate'}
                placeholder={'Start Date'}
                type={'date'}
                value={parseDate(tertiaryStudies[i].startDate)}
                onChange={(e) => (tertiaryStudies[i].startDate = e.target.value)}
              />
              <Input
                label={'Institute'}
                name={'institute'}
                placeholder={'Institute'}
                type={'text'}
                value={tertiaryStudies[i].institute}
                onChange={(e) => (tertiaryStudies[i].institute = e.target.value)}
              />
            </div>
            <div className={styles.columns}>
              <Input
                label={'Finish Date'}
                name={'endDate'}
                placeholder={'Finish Date'}
                type={'date'}
                value={parseDate(tertiaryStudies[i].endDate)}
                onChange={(e) => (tertiaryStudies[i].endDate = e.target.value)}
              />
              <TextArea
                label={'Description'}
                name={'description'}
                value={tertiaryStudies[i].description}
                onChange={(e) => (tertiaryStudies[i].description = e.target.value)}
              />
            </div>
          </div>
        ))}
        <AddButton
          type="button"
          onClick={() => {
            setTertiaryStudies([
              ...tertiaryStudies,
              { startDate: '', endDate: '', institute: '', description: '' }
            ]);
            setCounter({ ...inputsCounter, tertiaryStudies: inputsCounter.tertiaryStudies + 1 });
          }}
        />
        <h3>University Studies</h3>
        {[...Array(inputsCounter.universityStudies)].map((_, i) => (
          <div className={styles.fields} key={i}>
            <div className={styles.columns}>
              <Input
                label={'Start Date'}
                name={'startDate'}
                placeholder={'Start Date'}
                type={'date'}
                value={parseDate(universityStudies[i].startDate)}
                onChange={(e) => (universityStudies[i].startDate = e.target.value)}
              />
              <Input
                label={'Institute'}
                name={'institue'}
                placeholder={'Institute'}
                type={'text'}
                value={universityStudies[i].institute}
                onChange={(e) => (universityStudies[i].institute = e.target.value)}
              />
            </div>
            <div className={styles.columns}>
              <Input
                label={'Finish Date'}
                name={'endDate'}
                placeholder={'Finish Date'}
                type={'date'}
                value={parseDate(universityStudies[i].endDate)}
                onChange={(e) => (universityStudies[i].endDate = e.target.value)}
              />
              <TextArea
                label={'Description'}
                name={'description'}
                value={universityStudies[i].description}
                onChange={(e) => (universityStudies[i].description = e.target.value)}
              />
            </div>
          </div>
        ))}
        <AddButton
          type="button"
          onClick={() => {
            setUniversityStudies([
              ...universityStudies,
              { startDate: '', endDate: '', institute: '', description: '' }
            ]);
            setCounter({
              ...inputsCounter,
              universityStudies: inputsCounter.universityStudies + 1
            });
          }}
        />
        <h3>Informal Studies</h3>
        {[...Array(inputsCounter.informalStudies)].map((_, i) => (
          <div className={styles.fields} key={i}>
            <div className={styles.columns}>
              <Input
                label={'Start Date'}
                name={'startDate'}
                placeholder={'Start Date'}
                type={'date'}
                value={parseDate(informalStudies[i].startDate)}
                onChange={(e) => (informalStudies[i].startDate = e.target.value)}
              />
              <Input
                label={'Institute'}
                name={'institute'}
                placeholder={'Institute'}
                type={'text'}
                value={informalStudies[i].institute}
                onChange={(e) => (informalStudies[i].institute = e.target.value)}
              />
            </div>
            <div className={styles.columns}>
              <Input
                label={'Finish Date'}
                name={'endDate'}
                placeholder={'Finish Date'}
                type={'date'}
                value={parseDate(informalStudies[i].endDate)}
                onChange={(e) => (informalStudies[i].endDate = e.target.value)}
              />
              <TextArea
                label={'Description'}
                name={'description'}
                value={informalStudies[i].description}
                onChange={(e) => (informalStudies[i].description = e.target.value)}
              />
            </div>
          </div>
        ))}
        <AddButton
          type="button"
          onClick={() => {
            setInformalStudies([
              ...informalStudies,
              { startDate: '', endDate: '', institute: '', description: '' }
            ]);
            setCounter({ ...inputsCounter, informalStudies: inputsCounter.informalStudies + 1 });
          }}
        />
        <h3>Work Experience</h3>
        {[...Array(inputsCounter.workExperience)].map((_, i) => (
          <div className={styles.fields} key={i}>
            <div className={styles.columns}>
              <Input
                label={'Start Date'}
                name={'startDate'}
                placeholder={'Start Date'}
                type={'date'}
                value={parseDate(workExperience[i].startDate)}
                onChange={(e) => (workExperience[i].startDate = e.target.value)}
              />
              <Input
                label={'Company'}
                name={'company'}
                placeholder={'Company'}
                type={'text'}
                value={workExperience[i].company}
                onChange={(e) => (workExperience[i].company = e.target.value)}
              />
            </div>
            <div className={styles.columns}>
              <Input
                label={'Finish Date'}
                name={'endDate'}
                placeholder={'Finish Date'}
                type={'date'}
                value={parseDate(workExperience[i].endDate)}
                onChange={(e) => (workExperience[i].endDate = e.target.value)}
              />
              <TextArea
                label={'Description'}
                name={'description'}
                value={workExperience[i].description}
                onChange={(e) => (workExperience[i].description = e.target.value)}
              />
            </div>
          </div>
        ))}
        <AddButton
          type="button"
          onClick={() => {
            setWorkExperience([
              ...workExperience,
              { startDate: '', endDate: '', company: '', description: '' }
            ]);
            setCounter({ ...inputsCounter, workExperience: inputsCounter.workExperience + 1 });
          }}
        />
        <div className={styles.button}>
          <ButtonCancel disabled={isLoading} onClick={() => history.push('/postulants')} />
          <ButtonConfirm disabled={isLoading} type={'submit'} />
        </div>
        <ModalError error={error} onConfirm={() => dispatch(closeErrorModal())} />
      </form>
    </div>
  );
};

export default Form;
