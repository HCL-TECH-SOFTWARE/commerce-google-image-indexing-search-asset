/**
*==================================================
Copyright [2021] [HCL Technologies]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*==================================================
**/
import React, { useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Icon, InlineIcon } from "@iconify/react";
import cameraIcon from "@iconify/icons-mdi/camera";
import cameraSwitchOutline from '@iconify/icons-mdi/camera-switch-outline';
import cameraIris from '@iconify/icons-mdi/camera-iris';
import fileAccount from '@iconify/icons-mdi/file-account';
import windowClose from '@iconify/icons-mdi/window-close';
import CachedIcon from '@material-ui/icons/Cached';
import Webcam from "react-webcam";
import voiceImageTranscibeService from "../../../_foundation/apis/search/voiceImageTranscibe.service";
import { Button, DialogTitle } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from "@material-ui/core/DialogContent";
import { isMobile, withOrientationChange } from 'react-device-detect';
import productsService from "../../../_foundation/apis/search/products.service";
import { useHistory } from "react-router-dom";
import { forEach } from "lodash-es";


const videoConstraints1 = {
  width: 390,
  height: 250,
  facingMode: { exact: "user" }
};

interface ImageToTextProps {
  setSearchBox(val: any): any;
}

const ImageToText: React.FC<ImageToTextProps> = (props: any) => {
  const webcamRef: any = React.useRef(null);
  // const node: any = React.useRef(null);
  const [showImagesearchBox, setShowImagesearchBox] = React.useState(false);
  const [showWebcam, setShowWebcam] = React.useState(true);
  const [spinner, setSpinner] = React.useState<boolean>(false);
  const [selfieMode, setSelfieMode] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState(false);
  const [openCamera, setOpenCamera] = React.useState(false);
  const [openFile, setOpenFile] = React.useState(false);
  const [cameraMode, setCameraMode] = React.useState<any>('user');
  const history = useHistory();

  /***Image Search */
  const _imageSearch = () => {
    props.setSearchBox("");
    setShowImagesearchBox(!showImagesearchBox);

  };


  const uploadImage = React.useCallback(event => {
    //input is from file and not from web cam
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onloadend = () => {
      const imageSrc = new String(reader.result);
      setShowImagesearchBox(false);
      setOpenFile(false);
      setOpen(false);
      setSpinner(true);
      const base64bytes = new String(imageSrc).split(",")[1];
      imageToText(base64bytes);
    };
  }, []);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setShowImagesearchBox(false);
    setOpenCamera(false);
    setOpen(false);
    setSpinner(true);
    const base64bytes = new String(imageSrc).split(",")[1];
    imageToText(base64bytes);
  }, [webcamRef]);

  const imageToText = async base64bytes => {
    try {
      const res = await voiceImageTranscibeService.getImageTranscibetext(
        base64bytes
      );
      console.log("GOOGLE RESPONSE RECEIVED: ", res);
      refineImageSearchResult(res);
    } catch (err) {
      console.log("ERROR: ", err);
      setSpinner(false);
    }
  };

  const refineImageSearchResult = (res) => {
    let products = res.data.responses[0].productSearchResults.results;

    let productArr = products.map((productobj) => {
      let labelArr = productobj.product.productLabels;
      let result = labelArr.find(obj => {
        return obj.key === 'PARTNUMBER'
      })
      let obj = {
        score: Math.round(productobj.score * 100),
        partnumber: result.value,
        name: productobj.product.displayName
      };
      return obj;
    })
    console.log("product Array---", productArr);
    checkForExactMatch(productArr);

    setSpinner(false);
  }

  const checkForExactMatch = (products) => {
    let { score, partnumber } = products[0];
    const EXACTMATCH_SCORE = 95;
    const RELEVANTMATCH_SCORE = 5;

    if (score > EXACTMATCH_SCORE) {
      redirectToPDPPage(partnumber);
    } else if (score >= RELEVANTMATCH_SCORE) {
      let url = '/search?searchTerm=IMAGESEARCH&partNumbers=';
      let partnumbers = ((products.filter(product => product.score >= RELEVANTMATCH_SCORE)).map(obj => obj.partnumber)).join(",");
      url += partnumbers;
      history.push(url);
    } else {
      let url = '/search?searchTerm=IMAGESEARCH&partNumbers=Notfound';
      history.push(url);
    }
  }

  const redirectToPDPPage = (partnumber) => {
    let parameters: any = {
      partNumber: partnumber
    };
    productsService
      .findProductsUsingGET(parameters)
      .then((res) => {
        if (res.data.contents && res.data.contents.length > 0) {
          console.log("PDP Page URI--", res.data.contents[0].seo.href);
          history.push(res.data.contents[0].seo.href);
        }
      })
      .catch((e) => {
        console.log("could not retreive the parent product details", e);
      });
  }

  const toggleSelfieMode = () => {
    if (!(selfieMode)) {
      setCameraMode('user')
    } else {
      setCameraMode({ exact: 'environment' });
    }
    setSelfieMode(!selfieMode);

  }

  const handleClickOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);

  };
  const opencameraDialog = () => {
    setOpenCamera(true);
  }
  const handleMediaError = (err) => {
    alert("getUserMedia is not supported in your browser");
    setOpenCamera(false);
  }

  return (
    <>
      <span>
        <span className="icon" onClick={handleClickOpen}>
          <Icon icon={cameraIcon} width="24px" height="24px" />
        </span>

        {spinner ? (
          <span className="spinner-box">
            <CircularProgress />
          </span>
        ) : null}
      </span>
      <Dialog maxWidth='xs' fullWidth={true} className="file-dialog" onClose={() => setOpenFile(false)} aria-labelledby="simple-dialog-title" open={openFile}>
        <DialogTitle id="simple-dialog-title">Select Photo from Gallery</DialogTitle>
        <DialogContent>
          <div>
            <input
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
              onChange={uploadImage}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth='md' className="cam-dialog" onClose={() => { setOpenCamera(false) }} aria-labelledby="simple-dialog-title" open={openCamera}>
        <DialogContent>
          <div className="cam-wrapper">
            <Webcam
              audio={false}
              ref={webcamRef}
              onUserMediaError={handleMediaError}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: cameraMode
              }}
            />
          </div>
          <div className="camera-options">
            <button onClick={() => setOpenCamera(false)} className="close-btn" title="close">
              <span className="cam-icons"><Icon icon={windowClose} width="30px" height="34px" /></span>
            </button>
            <button onClick={capture} className="click-btn" title="Capture Image">
              <span className="cam-icons"><Icon icon={cameraIris} width="35px" height="40px" /></span>
            </button>
            {
              isMobile === true ? (
                < button onClick={toggleSelfieMode} className="switch-camera" title="switch Cameras">
                  <span className="cam-icons"><CachedIcon width="40px" height="44px" /></span>
                </button>) : null
            }
          </div>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth='xs' fullWidth={true} className="imageToText-dialog" onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Select Photo</DialogTitle>
        <DialogContent>

          <div className="options">
            <span className="icon" onClick={opencameraDialog}>
              <Icon icon={cameraIcon} width="24px" height="24px" />Take a beautiful Picture
           </span>
          </div>
          <div className="options">
            <span className="icon" onClick={() => setOpenFile(true)}>
              <Icon icon={fileAccount} width="24px" height="24px" />Choose an existing photo
           </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default withOrientationChange(ImageToText);
