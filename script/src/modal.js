var $ = global.jQuery;
var EventEmitter = require( 'events' )
var cssTimeToMs = require( './css-time-to-ms' )

module.exports = Modal;

function Modal () {
  if (!(this instanceof Modal)) {
    return new Modal();
  }

  var emitter = new EventEmitter()

  var showingClassName = 'modal--showing'
  var animateInClassName = 'animate-in'

  var toggler = Toggler()

  var selectors = {
    root: '.modal',
    left: '.modal__star--left',
    right: '.modal__star--right',
    top: '.modal__star--top',
    bottom: '.modal__star--bottom',
    help: '.modal__help',
  }

  var $selectors = {}
  var nodes = {}

  // populate `$selectors` and `nodes` from `selectors`
  Object.keys( selectors ).forEach( function ( key ) {
    $selectors[ key ] = $( selectors[ key ] )
    nodes[ key ] = $selectors[ key ].get( 0 )
  } )

  if ( $selectors.root.length === 0 ) return false;

  return {
    show: show,
    dismiss: dismiss,
    emitter: emitter,
  }

  function show ( force ) {
    var toShow = toggler.tryShow( force )

    if ( toShow === false ) return;

    emitter.emit( 'show' )
    
    // show the modal
    document.body.classList.add( showingClassName )

    // position modal elements to be animated in if they haven't already
    if ( parseFloat( getComputedStyle(nodes.top).getPropertyValue( '--animation-translate' ) ) === 0 ) {
      // remove animation duration
      var animationDuration = nodes.root.style.getPropertyValue( '--animation-duration' )
      nodes.root.style.setProperty( '--animation-duration', '0ms' )

      var topBBox = nodes.top.getBoundingClientRect()
      var topStartPosition = ( topBBox.left + topBBox.width ) * -1
      nodes.top.style.setProperty('--animation-translate', `${ topStartPosition }px`)

      var bottomBBox = nodes.bottom.getBoundingClientRect();
      var bottomStartPosition = ( ( window.innerWidth - bottomBBox.right ) + bottomBBox.width )
      nodes.bottom.style.setProperty('--animation-translate', `${ bottomStartPosition }px`)

      var leftBBox = nodes.left.getBoundingClientRect();
      var leftStartPosition = ( leftBBox.left + leftBBox.width ) * -1
      nodes.left.style.setProperty('--animation-translate', `${ leftStartPosition }px`)

      var rightBBox = nodes.right.getBoundingClientRect();
      var rightStartPosition = ( ( window.innerWidth - rightBBox.right ) + rightBBox.width )
      nodes.right.style.setProperty('--animation-translate', `${ rightStartPosition }px`)

      var helpBBox = nodes.help.getBoundingClientRect();
      var helpStartPosition = ( helpBBox.bottom + helpBBox.height )
      nodes.help.style.setProperty('--animation-translate', `${ helpStartPosition }px`)

      // restore animation duration
      nodes.root.style.setProperty( '--animation-duration', animationDuration )
    }
    
    // animate in
    setTimeout( function () {
      $selectors.root.addClass( animateInClassName )  
    }, 500 )
  }

  function dismiss () {

    var duration = cssTimeToMs(
      getComputedStyle( nodes.root ).getPropertyValue( '--animation-duration' ),
      0
    )

    if ( duration > 0 ) {
      $selectors.root.on( 'transitionend', completeDismissModal )
    }
    else {
      completeDismissModal()
    }

    $selectors.root.removeClass( animateInClassName )

    function completeDismissModal () {
      $selectors.root.off( 'transitionend', completeDismissModal )
      document.body.classList.remove( showingClassName )
      toggler.dismiss()
      emitter.emit( 'dismiss' )
    }
  }
}

function Toggler () {
  var dismissedKey = 'modal-dismissed'

  return {
    tryShow: tryShow,
    dismiss: dismiss,
  }

  function tryShow ( force ) {
    var dismissed = window.localStorage.getItem( dismissedKey )
    
    // determine whether to show modal or not
    var showModal = true;
    // do not show if previously dismissed
    // - turned off to make room for time based dismissal
    // if ( dismissed === "true" ) showModal = false;
    // do not show if coming from admissions site
    if ( document.referrer === "https://admissions.risd.edu/" ) showModal = false;
    // do not show if coming from same site
    // - turned off for now, because manually typing the URL gives you 
    //   the same host
    // if ( document.referrer.indexOf( window.location.host ) ) { showModal = false; console.log('samesies')}
    // show if forced
    if ( Number.isInteger( Number( dismissed ) ) ) {
      var lastDismissed = Number( dismissed )
      var now = timeInMilliSeconds()
      var sinceDismissed = now - lastDismissed
      var sessionTime = 30 * 1000 * 60  /* 30 minutes in milliseconds */
      if ( sinceDismissed > sessionTime ) {
        // show if the time that has elapsed since being dismissed
        // is longer than a single session time
        showModal = true
      }
      else {
        showModal = false;
      }
    }
    if ( force === true ) showModal = true;

    return showModal
  }

  function dismiss () {
    var dismissedTime = timeInMilliSeconds()
    window.localStorage.setItem( dismissedKey, dismissedTime )
  }

  function timeInMilliSeconds ( date ) {
    if ( ! date ) date = new Date()
    return date.getTime()
  }
}
