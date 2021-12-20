import React, { useEffect } from "react";
import "../../css/app.css";
import { makeStyles } from '@material-ui/core/styles';
import { uploadData } from "../features/uploadSlice";
import { useSelector, useDispatch } from "react-redux";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: 'none',
  },
}));


export const Upload = () => {
    const dispatch = useDispatch();
    const classes = useStyles();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);


    // Note that the ref is set async, so it might be null at some point
        function handleOpenDialog(e) {
            // Note that the ref is set async, so it might be null at some point
            if (buttonRef.current) {
              buttonRef.current.open(e);
            }
        };


      function handleOnFileLoad(data) {
        var arrayData = []
        console.log('---------------------------');
        for (let i = 1; i < data.length; i++) {
            let row = {
                city_ID:data[i].data[0],
                planted_date:data[i].data[1],
                most_recent_observation:data[i].data[2],
                retired_date:data[i].data[3],
                most_recent_observation_type:data[i].data[4],
                common_name:data[i].data[5],
                scientific_name:data[i].data[6],
                greater_metro:data[i].data[7],
                city:data[i].data[8],
                state:data[i].data[9],
                longitude_coordinate:data[i].data[10],
                latitude_coordinate:data[i].data[11],
                location_type:data[i].data[12],
                zipcode:data[i].data[13],
                address:data[i].data[14],
                neighborhood:data[i].data[15],
                location_name:data[i].data[16],
                ward:data[i].data[17],
                district:data[i].data[18],
                overhead_utility:data[i].data[19],
                diameter_breast_height_CM:data[i].data[20],
                condition:data[i].data[21],
                height_M:data[i].data[22],
                native:data[i].data[23],
                height_binned_M:data[i].data[24],
                diameter_breast_height_binned_CM:data[i].data[25],
                percent_population:data[i].data[26]
            }
            arrayData.push(row);
        }
        dispatch(uploadData(arrayData));
        console.log('---------------------------');
      }

      function handleOnError(err, file, inputElem, reason) {
        console.log('---------------------------');
        console.log(err);
        console.log('---------------------------');
      }

      function handleOnRemoveFile(data) {
        console.log('---------------------------');
        console.log(data);
        console.log('---------------------------');
      }

      function handleRemoveFile(e) {
        // Note that the ref is set async, so it might be null at some point
        if (buttonRef.current) {
          buttonRef.current.removeFile(e);
        }
      }

    // render component
    return (
         <>
        <h5>Basic Upload</h5>
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleOnFileLoad}
          onError={handleOnError}
          noClick
          noDrag
          onRemoveFile={handleOnRemoveFile}
        >
          {({ file }) => (
            <aside
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginBottom: 10,
              }}
            >
              <button
                type="button"
                onClick={handleOpenDialog}
                style={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  width: '40%',
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                Browse file
              </button>
              <div
                style={{
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: '#ccc',
                  height: 45,
                  lineHeight: 2.5,
                  marginTop: 5,
                  marginBottom: 5,
                  paddingLeft: 13,
                  paddingTop: 3,
                  width: '60%',
                }}
              >
                {file && file.name}
              </div>
              <button
                style={{
                  borderRadius: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
                onClick={handleRemoveFile}
              >
                Remove
              </button>
            </aside>
          )}
        </CSVReader>
      </>
    );


}