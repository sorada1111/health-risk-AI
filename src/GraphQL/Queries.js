import { gql } from "@apollo/client";

export const PATIENT_USER = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      role
      dob
      phone
      address
      vitals {
        id
        bodyTemperature
        heartRate
        bloodPressure
        respiratoryRate
        weight
        entryType
        createdAt
        updatedAt
      }
    }
  }
`;

export const NURSE_USER = gql`
  query user($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
      role
      dob
      phone
      address
    }
  }
`;

export const GET_PATIENT_LIST = gql`
  query patients {
    patients {
      id
      firstName
      lastName
      phone
      address
      email
    }
  }
`;

export const GET_ALERTS = gql`
  query {
    getPatientAlerts {
      patientId
      patientName
      message
      time
    }
  }
`;

export const GET_TIPS = gql`
  query {
    tipsByNurseAndPatient {
      tipName
      tipDescription
    }
  }
`;

export const GET_ALL_VITALS_FOR_USER = gql`
  query getAllVitalsForUser($userID: String!) {
    getAllVitalsForUser(userID: $userID) {
      id
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      weight
      entryType
      createdAt
      updatedAt
    }
  }
`;
