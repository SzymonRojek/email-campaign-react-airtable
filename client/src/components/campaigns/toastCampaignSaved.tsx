import { toastSuccess } from "helpers";
import { DEMO_EMAIL_NOTICE } from "sendEmail";
import { CampaignStatus } from "types";

// after saving a campaign - a sent one also says that no e-mail really went out
const toastCampaignSaved = (title: string, status: CampaignStatus) => {
  if (status === "draft") {
    toastSuccess(`Campaign "${title}" has been saved as a draft`);
    return;
  }

  toastSuccess(
    <div>
      <p>Campaign "{title}" has been sent</p>
      <p className="mt-1 text-sm opacity-80">{DEMO_EMAIL_NOTICE}</p>
    </div>,
    // longer - there is more to read
    8000
  );
};

export default toastCampaignSaved;
