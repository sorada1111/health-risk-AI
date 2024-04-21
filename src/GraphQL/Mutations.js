import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      role
      id
    }
  }
`;
export const REGISTER_USER_MUTATION = gql`
  mutation Mutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $role: String!
    $dob: Date!
    $phone: String!
    $address: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      role: $role
      dob: $dob
      phone: $phone
      address: $address
    ) {
      id
      email
    }
  }
`;

export const ADD_MY_VITAL = gql`
  mutation Mutation(
    $user_id: String!
    $bodyTemperature: String!
    $heartRate: String!
    $bloodPressure: String!
    $respiratoryRate: String!
    $weight: String!
    $entryType: EntryType!
  ) {
    addVitalToUser(
      userID: $user_id
      vitalData: {
        bodyTemperature: $bodyTemperature
        heartRate: $heartRate
        bloodPressure: $bloodPressure
        respiratoryRate: $respiratoryRate
        weight: $weight
        entryType: $entryType
      }
    ) {
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      weight
      entryType
    }
  }
`;
