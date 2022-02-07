import React from 'react';
import { Button, Card, Typography } from "antd";
import { useState } from "react";
import CreateVenture from "./CreateVenture";
import { useMoralisQuery } from "react-moralis";
import VentureCard from "./VentureCard"

const Main = () => {

    // const fetchedPosts = [
    //     {
    //         "address": "0x0232391823",
    //         "name": "Facebook",
    //         "description": "This is the next big thing!",
    //         "minimum": 0.1
    //     },
    //     {
    //         "address": "0x8032490340",
    //         "name": "Google",
    //         "description": "This is the next biggest thing!",
    //         "minimum": 0.2
    //     }
    // ];

    const queryPost = useMoralisQuery(
        "Ventures",
        (query) => query.exists("confirmed"),
        [],
        { live: true }
      );
    
    const fetchedPosts = JSON.parse(JSON.stringify(queryPost.data, ["ventureId", "contentId", "ventureManager", "minimum"])).reverse();
    console.log("this is your data")
    console.log(fetchedPosts);
    const havePosts = fetchedPosts.length > 0 ? true : false;

  return (
    <div style={{padding: "15px", maxWidth: "1030px", width: "100%"}}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px"}}>
            <h3>🏦 Open Ventures</h3>
            <CreateVenture />
        </div>
        <div>
            {havePosts ? fetchedPosts.map((post) => (
                <VentureCard key={post["ventureId"]} post={post}/>
            )) : <h6>Be the first one to post</h6>} 
        </div>
    </div>
  );
};

export default Main;
