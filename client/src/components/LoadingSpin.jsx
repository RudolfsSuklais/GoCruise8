import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function LoadingSpin() {
    return (
        <div className="loading">
            <Spin
                indicator={
                    <LoadingOutlined spin style={{ fontSize: "50px" }} />
                }
                size="large"
            />
        </div>
    );
}

export default LoadingSpin;
