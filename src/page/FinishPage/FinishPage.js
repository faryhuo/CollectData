import React from 'react';
import './FinishPage.styl';
import { Result, Button } from 'antd';

class FinishPage extends React.Component {
  constructor(props) {
        super(props);
        //react state
        this.state={
        }
    }


    render() {
        return (
            <div className="FinishPage">
            <Result
                status="success"
                title="Successfully upload license information file. Please check the excel if can be download!"
                subTitle="Download file need takes 1-5 minutes, please wait."
                extra={[
                  <Button type="primary">
                    Go Home
                  </Button>,
                ]}
              />
          </div>
        );
    }
}

export default FinishPage;