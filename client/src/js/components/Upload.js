import React, { useEffect, useState } from "react";
import "../../css/app.css";
import { makeStyles } from '@material-ui/core/styles';
import { uploadData } from "../features/uploadSlice";
import { useSelector, useDispatch } from "react-redux";

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import template from '../../assets/template.csv';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { CSVReader } from 'react-papaparse';

const buttonRef = React.createRef();
const dataColumns = ['city_ID',
                    'planted_date',
                    'most_recent_observation',
                    'retired_date',
                    'most_recent_observation_type',
                    'common_name',
                    'scientific_name',
                    'greater_metro',
                    'city',
                    'state',
                    'longitude_coordinate',
                    'latitude_coordinate',
                    'location_type',
                    'zipcode',
                    'address',
                    'neighborhood',
                    'location_name',
                    'ward',
                    'district',
                    'overhead_utility',
                    'diameter_breast_height_CM',
                    'condition',
                    'height_M',
                    'native',
                    'height_binned_M',
                    'diameter_breast_height_binned_CM',
                    'percent_population']

const requiredColumns = ['scientific_name']

function createData(name, description, required) {
  return { name,description,required };
}

const rows = [
    createData('city_ID','test','yes'),
    createData('planted_date','test','yes'),
    createData('most_recent_observation','test','yes'),
    createData('retired_date','test','yes'),
    createData('most_recent_observation_type','test','yes'),
    createData('common_name','test','yes'),
    createData('scientific_name','test','yes'),
    createData('greater_metro','test','yes'),
    createData('city','test','yes'),
    createData('state','test','yes'),
    createData('longitude_coordinate','test','yes'),
    createData('latitude_coordinate','test','yes'),
    createData('location_type','test','yes'),
    createData('zipcode','test','yes'),
    createData('address','test','yes'),
    createData('neighborhood','test','yes'),
    createData('location_name','test','yes'),
    createData('ward','test','yes'),
    createData('district','test','yes'),
    createData('overhead_utility','test','yes'),
    createData('diameter_breast_height_CM','test','yes'),
    createData('condition','test','yes'),
    createData('height_M','test','yes'),
    createData('native','test','yes'),
    createData('height_binned_M','test','yes'),
    createData('diameter_breast_height_binned_CM','test','yes')
];

export const Upload = () => {
    const dispatch = useDispatch();

    // state
    const stateMarker = useSelector(state => state.marker);
    const stateMap = useSelector(state => state.map);
    const [uploadArray, setUploadArray] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const errorList = uploadErrors.map((e) =>
        <p>{e}</p>
    );

      function handleOnFileLoad(data) {
        setUploadErrors([]);
        var arrayData = []
        let keys = Object.keys(data[0].data);
        console.log('---------------------------');
        for (let i = 0; i < data.length; i++) {
            let row = {}
            for (let j=0; j<keys.length; j++) {
                row[keys[j]] = data[i].data[keys[j]];
            }
            arrayData.push(row);
        }
        setUploadArray(arrayData);
        console.log(arrayData)
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

      function upload() {
        setUploadErrors([]);
        var isError = false;

        // Check if there are any data
        if (uploadArray.length === 0){
            setUploadErrors((uploadErrors) => [...uploadErrors, "Error: There is no data uploaded"]);
            isError = true;
            return
        }

        let keys = Object.keys(uploadArray[0]);

        // Check if there are the right number of columns
        if (keys.length !== dataColumns.length) {
            setUploadErrors((uploadErrors) => [...uploadErrors, "Error: The number of columns uploaded does not match the template."]);
            isError = true;
        }

        // Check if location and column name matches
        for (let i = 0; i<keys.length; i++) {
            if (!dataColumns.includes(keys[i])) {
                setUploadErrors((uploadErrors) => [...uploadErrors, "Error: Column '"+keys[i]+"' does not adhere to the template in name"]);
                isError = true;
            }
        }

        // Check if the required columns are all filled
        for (let i = 0; i<uploadArray.length; i++) {
            for (let j = 0; j<requiredColumns.length; j++) {
                console.log(uploadArray[i])
                console.log(requiredColumns[j])
                if (typeof uploadArray[i][requiredColumns[j]] === 'undefined') {
                    setUploadErrors((uploadErrors) => [...uploadErrors, "Error: Required column "+requiredColumns[j]+" has an empty row in position "+(i+2)]);
                    isError = true;
                }
            }
        }

        // Check if email is valid
        if (!validateEmail(document.getElementById('email').value)) {
            setUploadErrors((uploadErrors) => [...uploadErrors, "Error: Email address is in an invalid format"]);
            isError = true;
        }

        if (!isError) {
            //dispatch(uploadData(uploadArray));
            alert("good")
        }
      }

      function validateEmail(email) {
         if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return(true)
         } else {
            return(false)
         }
      }

    // render component
    return (
        <>
            <Grid style={{ marginTop:25 }} container justify="center" align="center" alignItems="center" spacing={2}>
                <Grid style={{ paddingLeft:100, paddingRight:100 }} item align="center" xs={12}>
                    <Typography variant="h5" gutterBottom>Instructions to Upload</Typography>
                    <Typography variant="body1" gutterBottom>
                        We have provided a template CSV structure (<a href={template} download="template.csv">Download CSV Template</a>) to follow.
                        Inputting your data in accordance to this template, keeping the header names unchanged will provide a valid file to upload to the server.
                        Some of the columns are required. See below for description:
                    </Typography>
                    <br/>
                    <div style={{paddingLeft:200,paddingRight:200}}>
                        <TableContainer style={{maxHeight:300}} component={Paper}>
                          <Table stickyHeader size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Column Name</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Required</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map((row) => (
                                <TableRow key={row.name}>
                                  <TableCell component="th" scope="row">
                                    {row.name}
                                  </TableCell>
                                  <TableCell align="right">{row.description}</TableCell>
                                  <TableCell align="right">{row.required}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                    </div>
                </Grid>
                <Grid item align="center" xs={12}>
                    <TextField id="email" label="Email (required)" variant="outlined" />
                </Grid>
                <Grid item style={{ paddingLeft:200, paddingRight:200 }} align="center" xs={12}>
                    <CSVReader
                      ref={buttonRef}
                      onDrop={handleOnFileLoad}
                      isReset={true}
                      onError={handleOnError}
                      addRemoveButton
                      onRemoveFile={handleOnRemoveFile}
                      config={{header:true,skipEmptyLines:true}}
                    >
                    <span>Drop CSV file here or click to upload.</span>
                </CSVReader>
                </Grid>
                <Grid item align="center" xs={12}>
                    <Button variant="contained" color="primary" onClick={upload}>Submit Data</Button>
                </Grid>
                <div>
                    {errorList}
                </div>
            </Grid>
        </>
    );


}