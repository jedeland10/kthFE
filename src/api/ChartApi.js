import AxiosFacade from "./AxiosFacade";
import config from "../config";

function ChartApi() {

    const chartAPI = AxiosFacade(config.diagramApi +'/diagram')

    return {

        getChartTypes: async () => {
            return chartAPI.GET('/types')
        },

        getChartsForUser: async (userId) => {
            return chartAPI.GET('/by-user/' + userId)
        },

        getChart: async (chartId) => {
            return chartAPI.GET('/' + chartId)
        },

        postChart: async (chart) => {
            return chartAPI.POST('', chart)
        },

        shareChart: async (chart) => {
            return chartAPI.PUT('/share', chart)
        }
    }
}

export default ChartApi
