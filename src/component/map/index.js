import React, {useContext, useEffect, useState} from 'react';
import ReactEcharts from 'echarts-for-react';
import china from './json/china.json';
import chinaMap from './json/province-map.json';
import * as echarts from 'echarts';
import walden from './walden.project.json';
import {useQueryDistribute} from '../../service/datamap';
import {LOCAL_STORAGE_AUTH, MESSAGE_ERROR} from "../../constant";
import jwt_decode from "jwt-decode";
import {
    DATAMAP_SUCCESS
}  from '../../constant/index';
import {getRowText} from '../../intl/provider';
import {AppContext} from "../../privacy/AppContext";
echarts.registerMap('china', china);



const umeStyle = {
    height: 400,
    width: 680
}

const optionParam = { 
    title: {},
    tooltip: {
        trigger: 'item'
    },
    legend: {
        color: 'black'
    },
    visualMap: {
        type: 'piecewise',
        show: true,
        pieces: [
            {min: 1000},
            {min: 500, max: 1000},
            {min: 300, max: 500},
            {min: 100, max: 300},
            {min: 50, max: 100},
            {min: 30, max: 50},
            {min: 20, max: 30},
            {min: 10, max: 20},
            {min: 5, max: 10},
            {min: 1, max: 5},
            {value: 0}
        ],
        color: ["#a8052b", "#f2416b", "#f2839d", "#f7bcca", "#088a70", "#0dd9b0", "#b5f5e8", "#bd8115",  "#e6c385","#FDEBCA", "#FFFFFF"]
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    roamController: {
        show: true,
        left: 'right',
        mapTypeControl: {
            'china': true
        }
    }
};

const provinceNameMapping = [...chinaMap];

export default function UserActiveMap() {
    const [ option, setOption ] = useState({});

    const {application, setMessage} = useContext(AppContext);
    const auth = JSON.parse(sessionStorage.getItem(LOCAL_STORAGE_AUTH));

    const [{data: getUsersGeography, loading: getUsersGeographyLoading, error: getUsersGeographyError}, getUsersGeographyApi] = useQueryDistribute(
        {}, {manual: true});

    const [ result, setResult] =useState([]);
    useEffect(() => {
        const user = auth && auth.token && jwt_decode(auth.token);
        if (user === 'undefined' || user === null) return;
        if (!application || application === 'undefined' || application === null) return;

        const obj = {...walden};
        echarts.registerTheme('walden', obj.theme);

        getUsersGeographyApi({
            url: '/user/geography',
            params: {
                appName: user.workspace + '_' + application,
                clientId:auth.clientId,
            }
        });
    }, [application]);

    useEffect(() => {
        if (getUsersGeographyLoading === false) {
            if (getUsersGeographyError) {
                setMessage({
                    type: MESSAGE_ERROR,
                    text: getRowText("getUsersGeographyError")
                });
            } else if (getUsersGeography) {
                if(getUsersGeography.dmcode === DATAMAP_SUCCESS){
                    setResult( getUsersGeography.result);
                }

            }
        }
    }, [getUsersGeographyLoading]);


    useEffect(() => {
                if ( result && result.length > 0 ) {
                    let data = result.map((item) => {
                        let province = provinceNameMapping.filter((m) => {return m.id === item.provinceKey});
                        let name = province && province.length > 0? province[0].name: item.provinceName;
                        return {
                            name: name,
                            value: item.count
                        }
                    });

                    setOption({
                        ...optionParam,
                        series: [
                            {
                                name: getRowText("topUser"),
                                type: 'map',
                                mapType: 'china',
                                roam: false,
                                label: {
                                    show: true,
                                    fontSize: 10
                                },
                                data: data
                            }
                        ]
                    });
                }                
    }, [result]);

    return (
        <React.Fragment>
            <ReactEcharts option={option} style={umeStyle} theme={"walden"}></ReactEcharts> 
        </React.Fragment>
      )
}
  