import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Candidate, CandidateFormValues } from "types";

interface CreateCandidateConfig {
  data: CandidateFormValues;
  // gets the new record - e.g. to open its details
  callback: (candidate: Candidate) => void;
}

const createCandidate = async ({
  data: { name, surname, email, status, role, expectedSalary, phone },
  callback,
}: CreateCandidateConfig) => {
  const postData = {
    fields: {
      name,
      surname,
      email,
      status,
      role,
      expectedSalary,
      phone,
    },
  };

  try {
    const response = await api.post<Candidate>("/candidates", postData);

    callback(response);
  } catch (error) {
    toastMessage(
      `The candidate has not been added: ${getErrorMessage(error)}`
    );
  }
};

export default createCandidate;
