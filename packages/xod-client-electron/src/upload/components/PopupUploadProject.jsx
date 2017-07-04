import React from 'react';
import PropTypes from 'prop-types';
import { STATUS, PopupForm } from 'xod-client';
import { Line as ProgressBar } from 'rc-progress';

class PopupUploadProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: props.isVisible,
    };

    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    if (this.canClose()) {
      this.props.onClose(this.props.upload.id);
    }
  }

  getTitle() {
    switch (this.props.upload.status) {
      default:
        return 'Uploading project';
    }
  }

  getMessage() {
    const message = (this.props.upload.message) ?
      (<p>{this.props.upload.message}</p>) : null;

    const preStyle = {
      overflow: 'auto',
      maxWidth: 'auto',
      maxHeight: '300px',
    };

    switch (this.props.upload.status) {
      case STATUS.SUCCEEDED:
        return (
          <div>
            <p>
              The program uploaded successfully.
            </p>
            {message}
          </div>
        );
      case STATUS.FAILED:
        return (
          <div>
            <p>
              Oops! Error occured.
            </p>
            <pre style={preStyle}>
              {message}
            </pre>
          </div>
        );
      default:
        return (
          <div>
            <p>
              Your program is uploading onto device.<br />
              Do not unplug the device.
            </p>
            {message}
          </div>
        );
    }
  }

  getProgress() {
    if (this.isSucceeded()) {
      return '100';
    }

    if (this.props.upload.percentage) {
      return this.props.upload.percentage.toString();
    }

    return '0';
  }

  isSucceeded() {
    return (this.props.upload.status === STATUS.SUCCEEDED);
  }

  isFailed() {
    return (this.props.upload.status === STATUS.FAILED);
  }

  canClose() {
    return (this.isSucceeded() || this.isFailed());
  }

  render() {
    const title = this.getTitle();
    const message = this.getMessage();
    const progress = this.getProgress();
    const color = this.isFailed() ? '#ed5b5b' : '#81c522';

    return (
      <PopupForm
        isVisible={this.props.isVisible}
        title={title}
        isClosable={this.canClose()}
        onClose={this.onClose}
      >
        <div className="ModalContent">
          <ProgressBar
            percent={progress}
            strokeWidth="5"
            strokeColor={color}
            strokeLinecap="square"
            trailWidth="5"
            trailColor="#373737"
            className="ProgressBar"
          />
        </div>
        <div className="ModalContent">
          {message}
        </div>
      </PopupForm>
    );
  }
}

PopupUploadProject.propTypes = {
  upload: PropTypes.object,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
};

PopupUploadProject.defaultProps = {
  upload: {
    status: STATUS.STARTED,
    message: '',
    percentage: 0,
  },
  isVisible: false,
};

export default PopupUploadProject;
