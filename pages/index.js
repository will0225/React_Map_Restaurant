import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
  browserName,
  BrowserTypes,
  osName,
  isIOS,
  isWindows,
  isMacOs,	
  isSafari,
  isAndroid,
  isChrome,
  isFirefox
} from "react-device-detect";
import useMediaQuery from '@material-ui/core/useMediaQuery';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 50
  },
  gridList: {
    width: 500,
    // height: 450,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    marginTop: 50
  },
  titleBar: {
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Avenir Next Demi Bold",
    fontWeight: "bold"
  },
  icon: {
    color: 'white',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

function Restaurant(props) {
  const [data, setData] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [detail, setDetail] = useState(null);
  const matches = useMediaQuery('(min-width:700px)');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClickOpen = (tile) => {
    setDetail(tile);
    setTimeout(() => {
      setOpen(true);
    }, 500)
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(isAndroid) {
        if(!isChrome) {
          setError(true);
          setErrorMessage('Please run in Chrome!');
        }
    } else if(isIOS) {
      if(!isSafari) {
        setError(true);
        setErrorMessage('Please run in Safari!');
      }
    } else {
      if(isChrome || isFirefox) {
        
      } else {
        setError(true);
        setErrorMessage('Please run in chrome!');
      }
    }
    axios.get('https://s3.amazonaws.com/br-codingexams/restaurants.json')
    .then(res => {
      console.log(res.data.restaurants)
      setData(res.data.restaurants);
    }).catch(error => {
      console.log(error);
    })
  }, [])
  const classes = useStyles();
  console.log(detail?.location?.lat)
  return (<>
      {!error?
      <div className={classes.root}>
        <div className="header" style={{ display: 'flex', height: '50px', background: '#43E895', position: "fixed", top: 0, width: '100%', zIndex: 999, padding: 6 }}>
          <p style={{ flex: 4, textAlign: "center", fontFamily: 'Avenir Next Demi Bold', fontSize: 17, color: '#FFFFFF', fontWeight: "bold"}}>Lunch Tyme</p>
          <Image
               src='/assets/icon_map.png'
               alt='Map'
               width={50}
               height={20}
               style={{flex: 1}}
           />
        </div>
        <GridList cellHeight={176} className={classes.gridList} style={{ marginTop: 50 }}>
          {data && data.map((tile, index) => (
              <GridListTile key={tile.backgroundImageURL} cols={(isMobile || matches)?2:1} rows={1} onClick={() => handleClickOpen(tile)}>
                <img src={tile.backgroundImageURL} alt={tile.category} />
                <GridListTileBar
                  title={tile.name}
                  subtitle={<span style={{ fontSize: 12, }}>{tile.category}</span>}
                  titlePosition="bottom"
                  actionPosition="left"
                  className={classes.titleBar}
                />
            </GridListTile>
          ))}
        </GridList>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <div className="header" style={{ display: 'flex', height: '50px', background: '#43E895',  width: '100%', zIndex: 999, padding: 6 }}>
            <Image
               src='/assets/ic_webBack.png'
               alt='Map'
               width={30}
               height={10}
               style={{flex: 1}}
               onClick={handleClose}
            />
            <p  style={{ flex: 4, textAlign: "center", fontFamily: 'Avenir Next Demi Bold', fontSize: 17, color: '#FFFFFF', fontWeight: "bold"}}>Lunch Tyme</p>
            <Image
               src='/assets/icon_map.png'
               alt='Map'
               width={50}
               height={20}
               style={{flex: 1}}
           />
          </div>
          <div className="map" style={{ height: 300 }}>
            <Map
              google={props.google}
              zoom={8}
              style={{ width: '100%', height: 300 }}
              initialCenter={{ lat: detail?.location?.lat, lng: detail?.location?.lng }}
            >
              <Marker position={{ lat: detail?.location?.lat, lng: detail?.location?.lng }} />
            </Map>
          </div>
          <div className="resDetail" style={{ height: 60, width: '100%', background: 'green', padding: 13 }}>
            <p style={{ fontSize: 16, fontFamily: 'Avenir Next Demi Bold', fontWeight: "bold", color: '#FFFFFF', margin: 0}}>{detail?.name}</p>
            <p style={{ fontSize: 12, color: '#FFFFFF', margin: 0 }}>{detail?.category}</p>
          </div>
          <div style={{ paddingLeft: 13 }}>
            <p style={{ marginTop: 16 }}>{detail && detail?.location.formattedAddress[0]}</p>
            <p>{detail && detail?.location?.formattedAddress[1]}</p>
            <p style={{ marginTop: 26 }}>{detail && detail?.contact?.formattedPhone}</p>
            <p style={{ marginTop: 26 }}>{detail?.contact?.twitter?'@'+detail?.contact?.twitter:''}</p>
          </div>
          {!isIOS?<div className="footer" style={{ display: 'flex', height: 50, background: '#2A2A2A', width: '100%', position: "fixed", bottom: 0, padding: 10 }}> 
          <div className="footerLeft" style={{ flex: 1, textAlign: 'center' }}>
              <Image
                src='/assets/tab_lunch.png'
                alt='Map'
                width={23}
                height={25}
                style={{flex: 1}}
            />
            <p style={{ margin: 0,  color: '#FFFFFF', fontFamily: 'Avenir Next Demi Bold', fontSize: 10 }}>lunch</p>
            </div>
            <div className="footerRight" style={{ flex: 1, textAlign: 'center' }}>
              <Image
                  src='/assets/tab_internets.png'
                  alt='Map'
                  width={20}
                  height={25}
                  style={{flex: 1}}
              />
              <p style={{ margin: 0, color: '#FFFFFF', fontFamily: 'Avenir Next Demi Bold', fontSize: 10 }}>Internets</p>
            </div>
          </div>:null}
        </Dialog>
        {!isIOS?<div className="footer" style={{ display: 'flex', height: 50, background: '#2A2A2A', width: '100%', padding: 10, position: 'fixed', bottom: 0 }}> 
            <div className="footerLeft" style={{ flex: 1, textAlign: 'center' }}>
              <Image
                src='/assets/tab_lunch.png'
                alt='Map'
                width={23}
                height={25}
                style={{flex: 1}}
            />
            <p style={{ margin: 0,  color: '#FFFFFF', fontFamily: 'Avenir Next Demi Bold', fontSize: 10 }}>lunch</p>
            </div>
            <div className="footerRight" style={{ flex: 1, textAlign: 'center' }}>
              <Image
                  src='/assets/tab_internets.png'
                  alt='Map'
                  width={20}
                  height={25}
                  style={{flex: 1}}
              />
              <p style={{ margin: 0, color: '#FFFFFF', fontFamily: 'Avenir Next Demi Bold', fontSize: 10 }}>Internets</p>
            </div>
        </div>
        :null}
      </div>
      :<div>
        {errorMessage}
      </div>}
      </>)
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCJgcL_4zdeEI7q4E-crcMP19Jx8YCbWR8'
})(Restaurant);