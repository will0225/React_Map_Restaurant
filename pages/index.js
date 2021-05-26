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
    marginTop: '50px !important;',
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

  subtitle: {
    fontSize: 12
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
  return (<>
      {!error?
      <div className={classes.root}>
        <div className="header" >
          <p>Lunch Tyme</p>
          <Image
               src='/assets/icon_map.png'
               alt='Map'
               width={50}
               height={20}
               style={{flex: 1}}
           />
        </div>
        <GridList cellHeight={176} className={classes.gridList}>
          {data && data.map((tile, index) => (
              <GridListTile key={tile.backgroundImageURL} cols={(isMobile || matches)?1:2} rows={1} onClick={() => handleClickOpen(tile)}>
                <img src={tile.backgroundImageURL} alt={tile.category} />
                <GridListTileBar
                  title={tile.name}
                  subtitle={<span className={classes.subtitle}>{tile.category}</span>}
                  titlePosition="bottom"
                  actionPosition="left"
                  className={classes.titleBar}
                />
            </GridListTile>
          ))}
        </GridList>
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
          <div className="modalHeader">
            <Image
               src='/assets/ic_webBack.png'
               alt='Map'
               width={30}
               height={10}
               style={{flex: 1}}
               onClick={handleClose}
            />
            <p>Lunch Tyme</p>
            <Image
               src='/assets/icon_map.png'
               alt='Map'
               width={50}
               height={20}
               style={{flex: 1}}
           />
          </div>
          <div className="map">
            <Map
              google={props.google}
              zoom={8}
              style={{ width: '100%', height: 300 }}
              initialCenter={{ lat: detail?.location?.lat, lng: detail?.location?.lng }}
            >
              <Marker position={{ lat: detail?.location?.lat, lng: detail?.location?.lng }} />
            </Map>
          </div>
          <div className="resDetail">
            <p className="resDetailName" >{detail?.name}</p>
            <p className="resDetailCategory">{detail?.category}</p>
          </div>
          <div className="resContact">
            <p className="resContactAddress" >{detail && detail?.location.formattedAddress[0]}</p>
            <p>{detail && detail?.location?.formattedAddress[1]}</p>
            <p className="resContactPhone">{detail && detail?.contact?.formattedPhone}</p>
            <p className="resContactPhone">{detail?.contact?.twitter?'@'+detail?.contact?.twitter:''}</p>
          </div>
          {!isIOS?<div className="footer"> 
          <div className="footerLeft">
              <Image
                src='/assets/tab_lunch.png'
                alt='Map'
                width={23}
                height={25}
                style={{flex: 1}}
            />
            <p>lunch</p>
            </div>
            <div className="footerRight">
              <Image
                  src='/assets/tab_internets.png'
                  alt='Map'
                  width={20}
                  height={25}
                  style={{flex: 1}}
              />
              <p>Internets</p>
            </div>
          </div>:null}
        </Dialog>
        {!isIOS?<div className="footer"> 
            <div className="footerLeft">
              <Image
                src='/assets/tab_lunch.png'
                alt='Map'
                width={23}
                height={25}
                style={{flex: 1}}
            />
            <p>lunch</p>
            </div>
            <div className="footerRight">
              <Image
                  src='/assets/tab_internets.png'
                  alt='Map'
                  width={20}
                  height={25}
                  style={{flex: 1}}
              />
              <p>Internets</p>
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
  apiKey: 'apiKey yours'
})(Restaurant);
