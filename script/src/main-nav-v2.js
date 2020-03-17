var $ = global.jQuery;

module.exports = MainNav;

/**
 * Main Nav uses the @risd/ui nav component
 * to define its markup, and this script to
 * define extra interations. Such as
 *
 * - Adding markup for icons that assist in
 *   differentiating different link types
 * - Adding class toggling to show nav items
 */
function MainNav() {
  if (!(this instanceof MainNav)) {
    return new MainNav()
  }
  var headings = Headings()
  var externalLinks = ExternalLinks()

  return { headings, externalLinks }
}

function Headings () {
  var classes = {
    root: 'main-nav__section-heading',
    toggle: 'main-nav__section-toggle',
    opened: 'main-nav__section--opened',
    link: 'main-nav__page-link',
  }

  init()

  // emitters would be nice
  return {}

  function init () {
    addLinksToHeadings()
  }

  function addLinksToHeadings () {
    $( `.${ classes.root } span span` )
      .replaceWith( function () {
        var $span = $( this )
        var text = $span.text()
        var textSlug = text.toLowerCase().replace( / /g, '-' )
        return `
          <span>
            <a href="/${ textSlug }/">${ text }</a>
          </span>`
      } )
  }
}

function ExternalLinks () {
  var classes = {
    link: 'main-nav__useful-link',
    icon: 'main-nav__useful-link-icon'
  }

  init()

  return {}

  function init () {
    appendExternalLinkIcon()
  }

  function appendExternalLinkIcon () {
    $( `.${ classes.link }` ).each( function ( index, link) {
      var $link = $( link )

      // this svg is a duplicate of /templates/partials/icons/arrow--naked.svg
      $link
        .children( 'a' )
        .prepend( `<span class="${ classes.icon }">
          <svg class="arrow arrow--naked" width="16px" height="13px" viewBox="0 0 16 13">
            <title>arrow naked</title>
            <path d="M9.47789 5.2828L0.903218 5.28279L0.903216 8.14102L9.47789 8.14102L4.61891 13L8.90624 13L15.1943 6.71191L8.90625 0.423814L4.61891 0.423814L9.47789 5.2828Z" class="arrow-geometry" />
          </svg>
        </span>` )
    } )
  }
}
