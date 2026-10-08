import * as Yup from "yup";

// the same limits as on the server (server/controllers/feedbackControllers.ts)
export const FEEDBACK_MESSAGE_MAX = 500;

const validationFeedback = Yup.object({
  name: Yup.string()
    .required("name is required")
    .trim()
    .max(40, "must not exceed 40 characters"),
  role: Yup.string().trim().max(40, "must not exceed 40 characters").default(""),
  message: Yup.string()
    .required("feedback is required")
    .trim()
    .min(3, "must be at least 3 characters")
    .max(FEEDBACK_MESSAGE_MAX, `must not exceed ${FEEDBACK_MESSAGE_MAX} characters`),
});

export default validationFeedback;
