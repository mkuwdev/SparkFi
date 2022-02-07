import React from 'react';
import { Button, Modal, Input } from "antd";
import { useState } from "react";
import AddressInput from "./AddressInput";

const CreateProposal = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [proposal, setProposal] = useState("");
    const [receiver, setReceiver] = useState();
    const [amount, setAmount] = useState();

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
        + Create Proposal
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
        <h3 style={{ marginBottom: "20px" }}>📝 Create Proposal</h3>
        
        <h5>Proposal Description</h5>
        <Input
            size="large"
            placeholder="Describe proposal..."
            style={{borderRadius: "8px", marginBottom: "10px"}}
            onChange={(e) => {
              setProposal(`${e.target.value}`);
            }}
        />

        <h5>Amount</h5>
        <Input
            size="large"
            placeholder="Enter amount..."
            style={{borderRadius: "8px", marginBottom: "10px"}}
            onChange={(e) => {
              setAmount(`${e.target.value}`);
            }}
            addonAfter="MATIC"
        />

        <h5>Receiving Address</h5>
        <AddressInput style={{borderRadius: "8px", marginBottom: "10px"}} autoFocus onChange={setReceiver} />

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
          onClick={() => {
            // publish venture to blockchain
            setIsModalVisible(false);
          }}
        >
          Publish Proposal
        </Button>
    </Modal>
    </>
  );
};

export default CreateProposal;
