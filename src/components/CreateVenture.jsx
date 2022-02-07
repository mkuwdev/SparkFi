import React from 'react';
import { Button, Modal, Card, Input } from "antd";
import { useState } from "react";
import Address from "./Address/Address";

import {useMoralisDapp} from "providers/MoralisDappProvider/MoralisDappProvider";
import {useMoralisFile} from "react-moralis";
import { useMoralis, useWeb3ExecuteFunction} from "react-moralis";
import {message} from "antd";

const CreateVenture = () => {

    const { Moralis } = useMoralis();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [venture, setVenture] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState();

    const {contractABI, contractAddress} = useMoralisDapp();
    const contractABIJson = JSON.parse(contractABI);
    const ipfsProcessor = useMoralisFile();
    const contractProcessor = useWeb3ExecuteFunction();

    async function addVenture(venture) {
      const contentUri = await processContent(venture);
      const wei = convertToWei(amount);
      console.log(wei);
      console.log(amount);
      const options = {
        contractAddress: contractAddress,
        functionName: "createVenture",
        abi: contractABIJson,
        params: {
            _contentUri: contentUri,
            _minimum: Moralis.Units.Token(wei, 0)
        },
      }
      console.log("Now we wait..")
      await contractProcessor.fetch({params:options,
          onSuccess: () => message.success("Venture Successfully Created!"),
          onError: (error) => message.error(error),
      });
      console.log("Done!")
  }

  const processContent = async (content) => {
    console.log("Processing IPFS..")
    const ipfsResult = await ipfsProcessor.saveFile(
        "venture.json",
        { base64: btoa(JSON.stringify(content)) },
        { saveIPFS: true}
    )
    console.log(ipfsResult._ipfs);
    return ipfsResult._ipfs;
  }

  const convertToWei = (num) => {
    return num * (10**18)
  }

  function onSubmit(e){
    e.preventDefault();
    addVenture({venture, description, amount})
  }

  return (
    <>
    <Button
        size="large"
        type="primary"
        style={{
            width: "100%",
            maxWidth: "200px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
        }}
        onClick={() => {
            setIsModalVisible(true)
        }}
    >
        + Create Venture
    </Button>
    <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
        padding: "15px",
        fontSize: "17px",
        fontWeight: "500",
        }}
        style={{ fontSize: "16px", fontWeight: "500",  }}
        width="400px"
    >   
        <h3 style={{ marginBottom: "20px" }}>📝 Create Venture</h3>
        
        <h5>Venture Name</h5>
        <Input
            size="large"
            placeholder="Enter name..."
            style={{borderRadius: "8px", marginBottom: "10px"}}
            onChange={(e) => {
              setVenture(`${e.target.value}`);
            }}
        />

        <h5>Description</h5>
        <Input
            size="large"
            placeholder="Enter description..."
            style={{borderRadius: "8px", marginBottom: "10px"}}
            onChange={(e) => {
              setDescription(`${e.target.value}`);
            }}
        />

        <h5>Minimum Contribution</h5>
        <Input
            size="large"
            placeholder="Enter minimum amount..."
            style={{borderRadius: "8px", marginBottom: "10px"}}
            onChange={(e) => {
              setAmount(`${e.target.value}`);
            }}
            addonAfter="MATIC"
        />

        <h5>Publisher</h5>
        <Card
          style={{
            marginTop: "10px",
            borderRadius: "1rem",
          }}
          bodyStyle={{ padding: "15px" }}
        >
          <Address
            avatar="left"
            size={10}
            style={{ fontSize: "20px" }}
          />
        </Card>

        <Button
          size="large"
          type="primary"
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "0.5rem",
            fontSize: "16px",
            fontWeight: "500",
          }}
          onClick={(e) => {
            onSubmit(e);
            setIsModalVisible(false);
          }}
        >
          Publish
        </Button>
    </Modal>
    </>
  );
};

export default CreateVenture;
