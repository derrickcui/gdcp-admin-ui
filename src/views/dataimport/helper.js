import React from 'react';
import {Fade, Typography} from "@mui/material";
import HelpContent from "./helperContent";
import Text from "./text";
import PopupState, {bindPopper, bindToggle} from "material-ui-popup-state";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Spreadsheet from "react-spreadsheet";

function SupportList() {
    return(<div style={{border: '1px solid grey', height: 300, width: 300, overflowY:'scroll'}}>
            {list.map((item, index) => {
                return <p key={index}>{item}</p>
            })}
        </div>
    );
}

function PopperPopupState() {
    return (
        <PopupState variant="popper" popupId="demo-popup-popper">
            {(popupState) => (
                <div style={{border: '0px solid grey', width: 300}}>
                    <Button variant="text" {...bindToggle(popupState)}>
                        {popupState.isOpen? '关闭':'查看'}所有支持的文件类型
                    </Button>
                    <Popper {...bindPopper(popupState)} transition placement='bottom-start'>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper>
                                    <SupportList/>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                </div>
            )}
        </PopupState>
    );
}

const data = [
    [{ value: "id" }, { value: "name" }, { value: "address" }, { value: "phone" }],
    [{ value: "1" }, { value: "张文华" }, { value: "北京市海淀区" }, { value: "1366668987" }],
    [{ value: "2" }, { value: "王刚" }, { value: "广东深圳" }, { value: "13356545887" }],
    [{ value: "3" }, { value: "刘光中" }, { value: "广东广州" }, { value: "1545555568" }],
];

export default function Helper(props) {
    return (
            <div style={{borderLeft: '1px solid #ebebeb', padding: 10, height: 125}}>
                <Typography style={{fontSize: 14, fontWeight: 'bold'}}>帮助信息</Typography>
                {props.indexType === 'local' &&
                        <Typography style={{fontSize: 14}}>
                            <p>上传本地文件，利用Geelink数据处理系统的能力解析文件内容，保存到智能感知系统中，文件格式支持<Text data='WORD'/>，<Text data='PDF'/>，<Text data='EXCEL'/>，<Text data='JSON'/>，<Text data='csv'/>等几百中文件类型。</p>
                            <p>每个文件导入后对应一条数据供搜索使用</p>
                            <p>预览数据按钮可以让您在数据导入系统之前了解该文档数据的结构及内容</p>
                            <h4>如果需要导入多个文件或者目录，可以联系Geelink技术支持或者客服，预先把文件上传到服务器后利用API能力来进行批量导入</h4>
                            <PopperPopupState/>
                        </Typography>

                }
                {props.indexType === 'uri' &&
                    <Typography style={{fontSize: 14}}>
                        导入指定的URI（统一的资源文件），URI协议包含<Text data='http'/>、<Text data='https'/>、<Text data='ftp'/>、<Text data='file'/>等，无论是哪种协议，必须确保系统能够访问。如果该资源需要安全验证才能访问，请联系Geelink运营。
                    </Typography>
                }
                {props.indexType === 'bdf' &&
                    <Typography style={{fontSize: 14}}>
                        导入批量数据文件，文件采用<Text data='JSON'/>格式，包含多个<Text data='URI'/>及其<Text data='META'/>数据。基于系统性能考虑，本格式文件不支持预览功能，但是您可以通过URI类型来预览单独的资源数据。
                        <br/>字段说明：
                        <li>id: 指定该数据的唯一标识，如果不提供，系统会自动生成UUID</li>
                        <li>uri：用来指定资源所在的位置</li>
                        <li>uriContentField：保存URI资源的数据内容，可以不提供，默认内容保存到content字段中。</li>
                        <li>meta：对该资源数据的补充，二者不能同时为空。</li>
                        <HelpContent/>
                    </Typography>
                }
                {props.indexType === 'database' &&
                <Typography style={{fontSize: 14}}>
                    <p>导入表格数据文件，文件支持<Text data='CSV'/>和<Text data='Excel'/>扩展名。</p>
                    <p>文件第一行必须为表头，由英文字母或者英文和数字组成，不能包含特殊字符以及中文，基于系统性能考虑，本格式文件不支持预览功能。</p>
                    <p>表格中的每一行都是一个独立的数据被索引到Geelink数据治理系统中供搜索客户端使用。</p>
                    <p>如果需要导入数据库中的数据，需要先把数据通过SQL导出到表格文件并把数据库字段名放在第一行，然后利用表格导入的能力进行数据索引</p>
                    <p>批量导入文件模板</p>
                    <Spreadsheet data={data} />
                </Typography>
                }
                {props.indexType === 'remoteFile' &&
                <Typography style={{fontSize: 14}}>
                    <Typography style={{fontSize: 14}}>
                        <p>对于大文件数据，应预先上传到Geelink服务器</p>
                        <p>利用Geelink数据处理系统的能力解析文件内容，保存到智能感知系统中，文件格式支持<Text data='WORD'/>，<Text data='PDF'/>，<Text data='EXCEL'/>，<Text data='JSON'/>，<Text data='csv'/>等常见文件类型。</p>
                    </Typography>
                </Typography>
                }
            </div>
    );
}

const list = [
    "application/java-vm",

    "audio/x-wav",
    "audio/x-aiff",
    "audio/basic",

    "application/x-midi",
    "audio/midi",

    "application/vnd.ms-htmlhelp",
    "application/chm",
    "application/x-chm",

    "text/x-java-source",
    "text/x-c++src",
    "text/x-groovy",

    "application/pkcs7-signature",
    "application/pkcs7-mime",

    "application/dif+xml",

    "image/vnd.dwg",

    "application/x-ibooks+zip",
    "application/epub+zip",

    "application/x-elf",
    "application/x-sharedlib",
    "application/x-executable",
    "application/x-msdownload",
    "application/x-coredump",
    "application/x-object",

    "application/atom+xml",
    "application/rss+xml",

    "application/x-font-adobe-metric",

    "application/x-font-ttf",

    "image/x-ozi",
    "application/x-snodas",
    "application/x-ecrg-toc",
    "image/envisat",
    "application/x-doq2",
    "application/x-rs2",
    "application/x-gsag",
    "application/x-ers",
    "application/fits",
    "application/x-pnm",
    "image/adrg",
    "image/gif",
    "application/x-generic-bin",
    "application/x-bt",
    "application/x-zmap",
    "application/x-hdf",
    "image/eir",
    "application/x-ace2",
    "application/grass-ascii-grid",
    "application/x-l1b",
    "application/x-gsc",
    "image/jp2",
    "image/hfa",
    "image/fits",
    "image/raster",
    "application/x-epsilon",
    "image/x-srp",
    "application/x-envi-hdr",
    "application/x-ctable2",
    "application/x-srtmhgt",
    "application/jaxa-pal-sar",
    "application/x-ndf",
    "application/sdts-raster",
    "application/x-gtx",
    "application/x-rst",
    "application/x-xyz",
    "application/terragen",
    "application/x-gs7bg",
    "image/arg",
    "application/elas",
    "image/big-gif",
    "application/x-geo-pdf",
    "application/x-ctg",
    "application/aaigrid",
    "application/x-lcp",
    "application/x-nwt-grc",
    "application/x-fast",
    "application/x-usgs-dem",
    "application/x-nwt-grd",
    "application/x-ingr",
    "application/x-envi",
    "application/x-rik",
    "application/x-blx",
    "application/x-wcs",
    "image/ceos",
    "application/x-ngs-geoid",
    "application/x-r",
    "image/bmp",
    "application/x-http",
    "application/x-til",
    "application/x-pds",
    "application/x-rasterlite",
    "application/x-gmt",
    "application/x-msgn",
    "image/ilwis",
    "application/aig",
    "application/x-rmf",
    "image/x-hdf5-image",
    "image/sar-ceos",
    "application/x-kro",
    "application/vrt",
    "application/x-netcdf",
    "image/nitf",
    "image/png",
    "image/geotiff",
    "image/x-mff2",
    "application/x-webp",
    "image/ida",
    "application/x-gsbg",
    "application/x-ntv2",
    "application/x-coasp",
    "application/x-los-las",
    "application/x-tsx",
    "application/x-bag",
    "image/fit",
    "application/x-lan",
    "application/x-map",
    "image/jpeg",
    "application/x-dods",
    "application/jdem",
    "application/gff",
    "application/x-isis2",
    "application/x-isis3",
    "application/xpm",
    "application/x-pcidsk",
    "application/x-gxf",
    "application/x-wms",
    "application/x-cosar",
    "image/bsb",
    "application/x-grib",
    "application/x-mbtiles",
    "application/x-cappi",
    "application/x-rpf-toc",
    "image/x-mff",
    "image/x-dimap",
    "image/x-pcraster",
    "application/x-ppi",
    "application/x-sdat",
    "application/pcisdk",
    "application/x-cpg",
    "application/leveller",
    "image/sgi",
    "image/x-fujibas",
    "image/x-airsar",
    "application/x-e00-grid",
    "application/x-kml",
    "application/x-p-aux",
    "application/x-doq1",
    "application/dted",
    "application/x-dipex",

    "application/geotopic",

    "text/iso19139+xml",

    "application/x-grib2",

    "application/x-hdf",

    "application/x-asp",
    "application/xhtml+xml",
    "application/vnd.wap.xhtml+xml",
    "text/html",

    "image/bpg",
    "image/x-bpg",

    "image/x-ms-bmp",
    "image/png",
    "image/x-icon",
    "image/vnd.wap.wbmp",
    "image/gif",
    "image/bmp",
    "image/x-xcf",

    "image/vnd.adobe.photoshop",

    "image/webp",

    "text/vnd.iptc.anpa",

    "application/x-isatab",

    "application/vnd.apple.iwork",
    "application/vnd.apple.numbers",
    "application/vnd.apple.keynote",
    "application/vnd.apple.pages",

    "message/rfc822",

    "application/x-matlab-data",

    "application/mbox",

    "application/vnd.ms-outlook-pst",

    "application/x-msaccess",

    "application/x-mspublisher",
    "application/x-tika-msoffice",
    "application/vnd.ms-excel",
    "application/sldworks",
    "application/x-tika-msworks-spreadsheet",
    "application/vnd.ms-powerpoint",
    "application/x-tika-msoffice-embedded; format=ole10_native",
    "application/vnd.ms-project",
    "application/x-tika-ooxml-protected",
    "application/msword",
    "application/vnd.ms-outlook",
    "application/vnd.visio",

    "application/vnd.ms-excel.sheet.3",
    "application/vnd.ms-excel.sheet.2",
    "application/vnd.ms-excel.workspace.3",
    "application/vnd.ms-excel.workspace.4",
    "application/vnd.ms-excel.sheet.4",

    "application/x-tnef",
    "application/ms-tnef",
    "application/vnd.ms-tnef",

    "application/vnd.ms-excel.sheet.macroenabled.12",
    "application/vnd.ms-powerpoint.presentation.macroenabled.12",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.template",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel.addin.macroenabled.12",
    "application/vnd.ms-word.document.macroenabled.12",
    "application/vnd.ms-excel.template.macroenabled.12",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
    "application/vnd.ms-powerpoint.addin.macroenabled.12",
    "application/vnd.ms-word.template.macroenabled.12",
    "application/x-tika-ooxml",
    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",

    "audio/mpeg",

    "video/3gpp2",
    "video/mp4",
    "video/quicktime",
    "audio/mp4",
    "application/mp4",
    "video/x-m4v",
    "video/3gpp",

    "application/x-netcdf",

    "image/x-ms-bmp",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/gif",

    "application/x-vnd.oasis.opendocument.graphics-template",
    "application/vnd.sun.xml.writer",
    "application/x-vnd.oasis.opendocument.text",
    "application/x-vnd.oasis.opendocument.text-web",
    "application/x-vnd.oasis.opendocument.spreadsheet-template",
    "application/vnd.oasis.opendocument.formula-template",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.image-template",
    "application/x-vnd.oasis.opendocument.graphics",
    "application/vnd.oasis.opendocument.chart-template",
    "application/vnd.oasis.opendocument.presentation-template",
    "application/x-vnd.oasis.opendocument.image-template",
    "application/vnd.oasis.opendocument.formula",
    "application/x-vnd.oasis.opendocument.image",
    "application/vnd.oasis.opendocument.spreadsheet-template",
    "application/x-vnd.oasis.opendocument.chart-template",
    "application/x-vnd.oasis.opendocument.formula",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.text-web",
    "application/vnd.oasis.opendocument.text-template",
    "application/vnd.oasis.opendocument.text",
    "application/x-vnd.oasis.opendocument.formula-template",
    "application/x-vnd.oasis.opendocument.spreadsheet",
    "application/x-vnd.oasis.opendocument.chart",
    "application/vnd.oasis.opendocument.text-master",
    "application/x-vnd.oasis.opendocument.text-master",
    "application/x-vnd.oasis.opendocument.text-template",
    "application/vnd.oasis.opendocument.graphics",
    "application/vnd.oasis.opendocument.graphics-template",
    "application/x-vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.image",
    "application/x-vnd.oasis.opendocument.presentation-template",
    "application/vnd.oasis.opendocument.chart",

    "application/pdf",

    "application/x-bzip",
    "application/x-bzip2",
    "application/gzip",
    "application/x-gzip",
    "application/x-xz",

    "application/x-tar",
    "application/x-tika-unix-dump",
    "application/java-archive",
    "application/x-7z-compressed",
    "application/x-archive",
    "application/x-cpio",
    "application/zip",

    "application/x-rar-compressed",

    "application/rtf",

    "text/plain",

    "video/x-flv",

    "application/xml",
    "image/svg+xml",

    "application/x-fictionbook+xml",

    "audio/x-oggflac",
    "audio/x-flac",

    "application/kate",
    "application/ogg",
    "audio/x-oggpcm",
    "video/x-oggyuv",
    "video/x-dirac",
    "video/x-ogm",
    "audio/ogg",
    "video/x-ogguvs",
    "video/theora",
    "video/x-oggrgb",
    "video/ogg",

    "audio/opus",
    "audio/ogg; codecs=opus",

    "audio/speex",
    "audio/ogg; codecs=speex",

    "audio/vorbis"
]