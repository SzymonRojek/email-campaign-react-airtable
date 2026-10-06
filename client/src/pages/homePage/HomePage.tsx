import { SiAirtable } from "react-icons/si";

import peopleImg from "img/people.svg";
import computerImg from "img/computer.svg";
import envelopeImg from "img/envelope.svg";

const linkClassName =
  "inline-flex items-center gap-1 px-1 font-semibold text-primary underline-offset-4 hover:underline";

const HomePage = () => (
  <div className="mx-auto w-full max-w-6xl px-4 py-10">
    <section className="rounded-2xl bg-white/30 p-6 text-primary shadow-xl backdrop-blur-xl md:p-10">
      <h1 className="inline-block rounded-md bg-primary px-4 py-2 text-4xl font-bold text-brand md:text-6xl">
        Hello 👋
      </h1>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold md:text-3xl">
            That's Email Campaign application. You don't have to send e-mails
            separately. Now you can send one email to all active subscribers.
          </h2>
          <img
            src={envelopeImg}
            alt=""
            className="mx-auto mt-8 hidden max-w-24 md:block"
          />
        </div>
        <img
          src={computerImg}
          alt="computer and envelopes"
          className="mx-auto w-full max-w-sm"
        />
      </div>

      <div className="mt-10 grid gap-6 text-base text-white md:grid-cols-2 md:text-xl">
        <p>
          The app is connected to the
          <a
            href="https://airtable.com/"
            target="_blank"
            rel="noreferrer"
            className={linkClassName}
          >
            <SiAirtable className="text-brand" /> Airtable
          </a>
          base. Easily brings all information together - organize, connect and
          change them as needed.
        </p>
        <p>
          Airtable base will provide its own <strong>rest API</strong> to
          create, read, update, and delete any records.
        </p>
      </div>

      <div className="mt-10 grid items-center gap-6 text-base text-white md:grid-cols-[10rem_1fr] md:text-xl">
        <img
          src={peopleImg}
          alt="people and envelopes"
          className="mx-auto w-full max-w-40"
        />
        <p>
          Add new subscriber, wait for an admin confirmation to get an active
          status and get more their details. Finally create an email campaign
          and send it to all your active subscribers just by one{" "}
          <strong>simple click</strong>!
        </p>
      </div>

      <p className="mt-10 text-base text-white md:text-xl">
        If you would like to read the detailed description of the application
        or just to get more information about used technologies, please check
        out the
        <a
          href="https://github.com/SzymonRojek/email-campaign-react-airtable"
          target="_blank"
          rel="noreferrer"
          className={linkClassName}
        >
          ReadMe
        </a>
        file of this project.
      </p>

      <p className="mt-6 text-base text-white md:text-xl">Thank you 🙏</p>
    </section>
  </div>
);

export default HomePage;
