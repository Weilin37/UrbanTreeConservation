import { useSelector } from "react-redux";
import { VictoryChart, VictoryLine, VictoryHistogram, VictoryLabel } from 'victory';
import Box from '@material-ui/core/Box';


// Custom map components
const DrawAnalysisSimilarity = () => {
    const stateMarker = useSelector(state => state.marker);
    const stateAnalysis = useSelector(state => state.analysis);

    if (stateMarker.view_status === "global" && stateAnalysis.similarityData['ds_similarity'] !== "") {
        let ds_label = stateAnalysis.similarityData['city1']+", "+stateAnalysis.similarityData['state1']+" vs. "+stateAnalysis.similarityData['city2']+", "+stateAnalysis.similarityData['state2'];
        return(
            <Box>
                <VictoryChart
                  domainPadding={{ x: 20 }}
                  padding={{ top: 50, bottom: 50, left: 50, right: 20 }}
                >
                    <VictoryLabel x={150} y={290} text={"Dice Sorensen Similarity"} />
                    <VictoryLabel x={25} y={20} text={ds_label} />
                    <VictoryHistogram
                        style={{
                          data: { fill: "#c43a31" }
                        }}
                        data={stateAnalysis.similarityHistogramData}
                        bins={100}
                    />
                    <VictoryLine
                      x={() => stateAnalysis.similarityData['ds_similarity']}
                      samples={1}
                      labels={[stateAnalysis.similarityData['ds_similarity']]}
                      labelComponent={<VictoryLabel renderInPortal dx={25} dy={-100}/>}
                    />
                </VictoryChart>
            </Box>
        )
    } else {
        return null
    }
}

export default DrawAnalysisSimilarity;