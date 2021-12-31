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

      function handleOnFileLoad(data) {
        // Check template validity
        for (let i = 0; i<data[0].data.length; i++) {
            if (!dataColumns.includes(data[0].data[i])) {
                alert("Error Detected: Column "+data[0].data[i]+" does not adhere to the template in either name or column position");
                return
            }
        }

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
        if (validateEmail(document.getElementById('email').value) && uploadArray.length > 0) {
            //dispatch(uploadData(uploadArray));
        } else if (!validateEmail(document.getElementById('email').value)) {
            alert("You have entered an invalid email address. Please try again")
        } else if (uploadArray.length === 0) {
            alert("There is no dataset present to upload. Either no data was uploaded or there was an error in the data")
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
                    >
                    <span>Drop CSV file here or click to upload.</span>
                </CSVReader>
                </Grid>
                <Grid item align="center" xs={12}>
                    <Button variant="contained" color="primary" onClick={upload}>Submit Data</Button>
                </Grid>
            </Grid>
        </>
    );


}