import React from 'react';
import axios from 'utils/axios';
import { API_URL } from 'config';
import { useState, useEffect } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  Button,
  Box
} from '@mui/material';
import { Save2, Check, CloseCircle } from 'iconsax-react';
import { FormattedMessage } from 'react-intl';

const Accesses = () => {
  const [roles, setRoles] = useState([]);
  const [sections, setSections] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessDataCache, setAccessDataCache] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetchRoles();
      await fetchSections();

      const localData = localStorage.getItem('accessDataCache');
      if (localData) {
        setAccessDataCache(JSON.parse(localData));
      }

      if (selectedRole) {
        await updateAccessListForRole(selectedRole);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRole && sections.length > 0) {
      updateAccessListForRole(selectedRole);
    }
  }, [selectedRole, sections, accessDataCache]);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/Roles/all/activated`);
      setRoles(response.data?.$values);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${API_URL}/sections`);
      setSections(response.data?.$values);
    } catch (error) {
      console.error('Error while fetching sections:', error);
    }
  };

  const fetchAccessListForRole = async (roleId) => {
    const response = await axios.get(`${API_URL}/accesses/role/${roleId}`);
    const data = response.data?.$values || [];

    const accessListWithAllSections = sections.map((section) => {
      const sectionAccess = data.find((a) => a.section.id === section.id);
      return sectionAccess
        ? { ...sectionAccess, ...section, accessId: sectionAccess.id }
        : {
            ...section,
            roleId,
            insert: false,
            read: false,
            update: false,
            delete: false
          };
    });

    return accessListWithAllSections;
  };

  const updateAccessListForRole = async (roleId) => {
    let accessListForRole;

    if (accessDataCache[roleId]) {
      accessListForRole = accessDataCache[roleId];
    } else {
      accessListForRole = await fetchAccessListForRole(roleId);
      setAccessDataCache((prevState) => ({
        ...prevState,
        [roleId]: accessListForRole
      }));
    }

    setAccessList(accessListForRole);
  };

  const handleRoleChange = async (event) => {
    const value = event.target.value;

    if (selectedRole) {
      setAccessDataCache((prevState) => ({
        ...prevState,
        [selectedRole]: accessList
      }));
    }

    setSelectedRole(value);
  };

  const saveAccessList = async () => {
    setLoading(true);
    try {
      const updatedAccessList = [...accessList];

      for (const access of accessList) {
        const accessUpdateDto = {
          roleId: selectedRole,
          sectionId: access.id,
          insert: access.insert,
          read: access.read,
          update: access.update,
          delete: access.delete
        };

        if (access.accessId) {
          await axios.put(`${API_URL}/accesses/${access.accessId}`, accessUpdateDto);
        } else {
          const response = await axios.post(`${API_URL}/accesses`, accessUpdateDto);
          const newAccessId = response.data.id;
          const index = updatedAccessList.findIndex((a) => a.id === access.id);
          if (index !== -1) {
            updatedAccessList[index].accessId = newAccessId;
          }
        }
      }

      setAccessDataCache((prevState) => ({
        ...prevState,
        [selectedRole]: updatedAccessList
      }));
      localStorage.setItem('accessDataCache', JSON.stringify(accessDataCache));
      setLoading(false);
    } catch (error) {
      console.error('Error while saving access list:', error);
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e, record, key) => {
    const newAccessList = accessList.map((access) => {
      if (access.id === record.id) {
        return {
          ...access,
          [key]: e.target.checked
        };
      }
      return access;
    });

    setAccessList(newAccessList);
  };

  const checkAllAccess = () => {
    const updatedAccessList = accessList.map((access) => ({
      ...access,
      insert: true,
      read: true,
      update: true,
      delete: true
    }));

    setAccessList(updatedAccessList);
  };

  const uncheckAllAccess = () => {
    const updatedAccessList = accessList.map((access) => ({
      ...access,
      insert: false,
      read: false,
      update: false,
      delete: false
    }));

    setAccessList(updatedAccessList);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <FormControl fullWidth>
        <InputLabel id="role-select-label">
          <FormattedMessage id="selectARole" />
        </InputLabel>
        <Select labelId="role-select-label" id="role-select" value={selectedRole} onChange={handleRoleChange}>
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedRole && (
        <>
          <Box my={4} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={saveAccessList} startIcon={<Save2 />}>
              <FormattedMessage id="save" />
            </Button>
            <Button variant="contained" color="secondary" onClick={checkAllAccess} style={{ marginLeft: '10px' }} startIcon={<Check />}>
              <FormattedMessage id="checkAll" />
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={uncheckAllAccess}
              style={{ marginLeft: '10px' }}
              startIcon={<CloseCircle />}
            >
              <FormattedMessage id="uncheckAll" />
            </Button>
          </Box>
          <Box my={4}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Section</TableCell>
                    <TableCell align="center">Insertion</TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="reading" />
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="updating" />
                    </TableCell>
                    <TableCell align="center">
                      <FormattedMessage id="deletion" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accessList.map((access) => (
                    <TableRow key={access.id}>
                      <TableCell>{access.label}</TableCell>
                      <TableCell align="center">
                        <Checkbox checked={access.insert} onChange={(e) => handleCheckboxChange(e, access, 'insert')} />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox checked={access.read} onChange={(e) => handleCheckboxChange(e, access, 'read')} />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox checked={access.update} onChange={(e) => handleCheckboxChange(e, access, 'update')} />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox checked={access.delete} onChange={(e) => handleCheckboxChange(e, access, 'delete')} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Accesses;
