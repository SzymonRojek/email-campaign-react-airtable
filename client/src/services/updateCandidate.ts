import api from "./api";
import getErrorMessage from "./getErrorMessage";
import { toastMessage } from "helpers";
import { Candidate, CandidateFields, CandidateFormValues } from "types";

interface UpdateCandidateConfig {
  data: CandidateFormValues;
  id?: string;
  callback: (fields: CandidateFields) => void;
}

const updateCandidate = async ({
  data: { name, surname, email, role, status, expectedSalary, phone },
  id,
  callback,
}: UpdateCandidateConfig) => {
  const patchData = {
    fields: {
      name,
      email,
      surname,
      status,
      expectedSalary,
      phone,
      role,
    },
  };

  try {
    const response = await api.patch<Candidate>(
      `/candidates/${id}`,
      patchData
    );

    callback(response.fields);
  } catch (error) {
    toastMessage(
      `The candidate has not been saved: ${getErrorMessage(error)}`
    );
  }
};

export default updateCandidate;
