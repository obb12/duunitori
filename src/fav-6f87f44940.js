var hideFavFullAlert,hideFavAdded,FAVORITES_API_URL="/dtaccounts/favorite_jobs",JOB_API_URL="/tyopaikat/tyo",FAVORITES_COOKIE="dtfav",UID=window.USER_ID,$favPopup=$(".js-fav-popup"),$favPopupArrow=$(".js-fav-popup-arrow"),$favPopupContent=$(".js-fav-popup__jobentries"),$favPopupToggle=$(".js-show-fav-popup"),$favSave=$(".js-save-favorite"),$favNumber=$(".js-fav-number"),$favActions=$(".js-fav-actions"),$favAdded=$(".js-fav-added"),$favAddedTitle=$(".js-fav-added-title"),$favFullAlert=$(".js-fav-full-alert"),$stickyFilters=$(".js-sticky-filters"),$notStickyFilters=$(".js-not-sticky-filters"),FAVORITES=[],popupOffsets={arrow:{top:0,left:0},popup:{top:0,left:0}};function getFavCookie(){return getCookie(FAVORITES_COOKIE)||[]}function setFavCookie(e){setCookie(FAVORITES_COOKIE,favArrToStr(e),1)}function getFavData(e){var a=e?{ids:e}:{};return $.get(FAVORITES_API_URL,a)}function addFavDB(e){return $.get(JOB_API_URL+"/"+e+"/lisaa_suosikkeihin")}function delFavDB(e){return $.post(JOB_API_URL+"/"+e+"/poista_suosikeista")}function favArrToStr(e){if(e)return e.reduce(function(e,a,t){return e+(t?",":"")+a.id},"")}function timeDiff(e,a,t){switch(t){case"milliseconds":msToUnit=1;break;case"seconds":msToUnit=1e3;break;case"minutes":msToUnit=6e4;break;case"hours":msToUnit=36e5;break;case"days":msToUnit=864e5;break;case"months":msToUnit=2592e6;break;case"years":msToUnit=31536e6;break;default:msToUnit=864e5}return Math.floor((a-e)/msToUnit)}function saveFavToDataLayer(e){dataLayer.push({event:"saveFavorite",companyName:e})}function deleteFavToDataLayer(){dataLayer.push({event:"deleteFavorite"})}function saveFav(e,a,t){UID&&addFavDB(e),!UID&&FAVORITES.length>=5?showFavFullAlert():getFavData(a).done(function(e){saveFavToDataLayer(e.results[0].company_name),FAVORITES.unshift(e.results[0]),setFavCookie(FAVORITES),favsToPopup(FAVORITES),showFavAdded(e.results[0],t),t.addClass("job-box__icon--active"),t.find(".icons__label").hide()})}function delFav(e,a){UID&&delFavDB(e),deleteFavToDataLayer();var t=$('[data-job-slug="'+e+'"]');setFavCookie(FAVORITES=FAVORITES.filter(function(a){return e!=a.slug})),favsToPopup(FAVORITES),a&&showFavPopup(),t&&(t.removeClass("job-box__icon--active"),t.find(".icons__label").show())}function toggleFav(e,a,t){FAVORITES.some(function(a){return a.slug==e})?delFav(e):saveFav(e,a,t)}function createFavRows(e){return e.reduce(function(e,a){return e+createFavRow(a)},"")}function createFavRow(e){var a="";return a+='<a class="list list--simple__item fav-popup__jobentry" href="'+("/tyopaikat/tyo/"+e.slug)+'?click_from=fav_box" data-job-id="'+e.id+'" data-job-slug="'+e.slug+'">',a+="<span>"+e.heading+"</span>",a+='<span class="fav-popup__jobentry__company">'+createTimeTag(e.date_ends)+e.company_name+"</span>",a+='<div class="fav-popup__jobentry__delete__wrapper js-del-favorite"><div class="fav-popup__jobentry__delete" data-job-id="'+e.id+'" data-job-slug="'+e.slug+'"></div></div>',a+="</a>"}function createNoFavs(){var e='<p class="fav-popup__empty">Hups! Sinulla ei ole vielä lainkaan suosikkeja. Tallenna niitä napauttamalla sydäntä haluamasi ilmoituksen kohdalta.</p>';return UID||(e+='<div class="fav-popup__empty">',e+='<div class="fav-popup__actions 1/1 grid__cell"><div class="fav-popup__warning"><img class="fav-popup__warning__icon" src="https://skyhood-duunitori5.s3.amazonaws.com/static/web/images/ic_favourite-alert.svg"><p class="fav-popup__warning__text">Suosikkejasi ei tallenneta! Rekisteröidy, niin voit palata niihin vielä myöhemmin.</p></div></div>',e+='<div class="fav-popup__buttons"><a href="/dtaccounts/register?palvelu=dtaccounts" class="btn btn--success fav-popup__buttons__btn">Rekisteröidy</a><a href="/dtaccounts/login" class="btn btn-outline btn-outline--success fav-popup__buttons__btn">Kirjaudu</a></div>',e+="</div>"),e}function createTimeTag(e){var a,t,o,s=new Date(e),i=timeDiff(new Date,s,"days"),n=s.getDate()+"."+(s.getMonth()+1),r="";return i<0?o="Päättynyt "+n:0===i?(a="error",t="Haku päättyy tänään"):1===i?(a="error",t="1 päivä jäljellä"):i<=5?(a="error",t=i+" päivää jäljellä"):o=i<=31?"Päättyy "+n:"Toistaiseksi voimassa",t?(r+='<span class="tag tag--'+a+'">',r+=t,r+="</span>"):o&&(r+="<span>"+o+" - </span>"),r}function hideNumber(){$favNumber.parent().hide(),$favNumber.parent().parent().removeClass("fav-icon--with-circle")}function showNumber(){$favNumber.parent().show(),$favNumber.parent().parent().addClass("fav-icon--with-circle")}function hideActions(){$favActions.hide()}function showActions(){$favActions.show()}function showFavAdded(e,a){var t={};hideFavAdded&&clearTimeout(hideFavAdded),$(window).width()>1024?(t.top=a.offset().top-$favAdded.outerHeight()/2+40,t.transform="initial",t.position="absolute",a.offset().left+$favAdded.outerWidth()>$(window).width()&&a.parents(".grid")[0]?(t.left=$(a.parents(".grid")[0]).offset().left-$favAdded.outerWidth()-60,$favAdded.addClass("arrow-right"),$favAdded.removeClass("arrow-left")):($favAdded.removeClass("arrow-right"),$favAdded.addClass("arrow-left"),t.left=a.offset().left+a.outerWidth()+50)):(t.top=0,t.left="50%",t.transform="translateX(-50%)",t.position="fixed"),$favAddedTitle.text(e.heading),$favAdded.css(t),$favAdded.removeClass("fav-added--hidden"),hideFavAdded=setTimeout(function(){$favAdded.addClass("fav-added--hidden")},6e3)}function favsToPopup(e){if(!e.length||e.length<=0)return $favPopupContent.html(createNoFavs()),hideNumber(),void hideActions();UID?($favNumber.html(e.length),$favNumber.parent().removeClass("fav-icon__circle--error")):($favNumber.html('<svg width="2px" height="9px" viewBox="0 0 2 9" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Group-5" fill="#FFFFFF" fill-rule="nonzero"><polygon id="Path" points="0 -3.64597241e-13 0 5.67 2 5.67 2 -3.64597241e-13"></polygon><polygon id="Path" points="0 7.38 0 9 2 9 2 7.38"></polygon></g></g></svg>'),$favNumber.parent().addClass("fav-icon__circle--error")),showActions(),showNumber(),$favPopupContent.html(createFavRows(e.slice(0,5)))}function toggleFavPopup(e){$favPopup.toggle(),$(window).width>=1024&&$favPopupArrow.toggle(),positionFavPopup(e)}function showFavPopup(e){$favPopup.show(),$(window).width>=1024&&$favPopupArrow.show(),positionFavPopup(e)}function updateFavoriteElementsState(){$favSave.each(function(){$el=$(this),FAVORITES.some(function(e){return e.slug===$el.data("job-slug")})&&($el.addClass("job-box__icon--active"),$el.find(".icons__label").hide())})}function positionFavPopup(e){e&&e.length&&(popupOffsets.arrow.top=e.offset().top+e.outerHeight(!0)-10,popupOffsets.arrow.left=e.offset().left+e.outerWidth()/2-10,popupOffsets.popup.top=popupOffsets.arrow.top+7,popupOffsets.popup.left=$(window).width()<=1024?0:popupOffsets.arrow.left+$favPopup.width()>$(window).width()?popupOffsets.arrow.left-$favPopup.width():popupOffsets.arrow.left-14),$favPopupArrow.offset(popupOffsets.arrow),$favPopup.offset(popupOffsets.popup)}function showFavFullAlert(){var e=$(".js-modal-overlay--fav");$favFullAlert.show(),e.show()}function makeSticky(e,a,t){$(window).width()>=1024||(e.show(),a.hide(),t.removeClass("grid-sandbox--background--mobile"),t.addClass("search-sticky__wrapper"),t.css({position:"fixed"}))}function makeNotSticky(e,a,t){$(window).width()>=1024||(e.hide(),a.show(),t.addClass("grid-sandbox--background--mobile"),t.removeClass("search-sticky__wrapper"),t.css({position:"relative"}))}function handleData(e){favsToPopup(FAVORITES=e.results),setFavCookie(FAVORITES),updateFavoriteElementsState()}function stickyFilters(e,a,t){if(e&&a){$(window).scrollTop()>110&&makeSticky(e,a,t),$(window).scroll(function(){$(window).scrollTop()>110?makeSticky(e,a,t):makeNotSticky(e,a,t)}),$(window).resize(function(){$(window).width()>=1024&&makeNotSticky(e,a,t)})}}$favPopupToggle.click(function(e){e.preventDefault(),toggleFavPopup($(this))}),$favSave.click(function(e){var a=$(this).data("job-slug"),t=$(this).data("job-id")||$(this).attr("id");e.stopImmediatePropagation(),e.preventDefault(),toggleFav(a,t,$(this)),$(e.target).blur(),$(this).blur()}),$(document).click(function(e){var a,t=$(e.target);if($(e.target).parents(".js-show-fav-popup").length||$(e.target).parents(".js-fav-popup").length||($favPopup.hide(),$favPopupArrow.hide()),t.hasClass("js-del-favorite")||t.parent().hasClass("js-del-favorite")){if(!(a=t.data("job-slug")))return;return e.preventDefault(),t.hasClass("js-fav-nopopup")||t.parent().hasClass("js-fav-nopopup")?void delFav(a):(delFav(a,!0),!1)}if(t.hasClass("js-del-favorite-on-page")||t.parent().hasClass("js-del-favorite-on-page")){if(!(a=t.data("job-slug")||t.parent().data("job-slug")))return;e.preventDefault(),delFav(a),t.parents(".job-box").remove()}}),$(document).ready(function(){favCookie=UID?null:getFavCookie(),getFavData(favCookie).done(handleData),stickyFilters($stickyFilters,$notStickyFilters,$stickyFilters.parent())});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhdi5qcyJdLCJuYW1lcyI6WyJoaWRlRmF2RnVsbEFsZXJ0IiwiaGlkZUZhdkFkZGVkIiwiRkFWT1JJVEVTX0FQSV9VUkwiLCJKT0JfQVBJX1VSTCIsIkZBVk9SSVRFU19DT09LSUUiLCJVSUQiLCJ3aW5kb3ciLCJVU0VSX0lEIiwiJGZhdlBvcHVwIiwiJCIsIiRmYXZQb3B1cEFycm93IiwiJGZhdlBvcHVwQ29udGVudCIsIiRmYXZQb3B1cFRvZ2dsZSIsIiRmYXZTYXZlIiwiJGZhdk51bWJlciIsIiRmYXZBY3Rpb25zIiwiJGZhdkFkZGVkIiwiJGZhdkFkZGVkVGl0bGUiLCIkZmF2RnVsbEFsZXJ0IiwiJHN0aWNreUZpbHRlcnMiLCIkbm90U3RpY2t5RmlsdGVycyIsIkZBVk9SSVRFUyIsInBvcHVwT2Zmc2V0cyIsImFycm93IiwidG9wIiwibGVmdCIsInBvcHVwIiwiZ2V0RmF2Q29va2llIiwiZ2V0Q29va2llIiwic2V0RmF2Q29va2llIiwiZmF2cyIsInNldENvb2tpZSIsImZhdkFyclRvU3RyIiwiZ2V0RmF2RGF0YSIsImRhdGEiLCJpZHMiLCJnZXQiLCJhZGRGYXZEQiIsInNsdWciLCJkZWxGYXZEQiIsInBvc3QiLCJyZWR1Y2UiLCJhIiwiYyIsImkiLCJpZCIsInRpbWVEaWZmIiwiZDEiLCJkMiIsInVuaXQiLCJtc1RvVW5pdCIsIk1hdGgiLCJmbG9vciIsInNhdmVGYXZUb0RhdGFMYXllciIsIm5hbWUiLCJkYXRhTGF5ZXIiLCJwdXNoIiwiZXZlbnQiLCJjb21wYW55TmFtZSIsImRlbGV0ZUZhdlRvRGF0YUxheWVyIiwic2F2ZUZhdiIsIiRlbCIsImxlbmd0aCIsInNob3dGYXZGdWxsQWxlcnQiLCJkb25lIiwicmVzdWx0cyIsImNvbXBhbnlfbmFtZSIsInVuc2hpZnQiLCJmYXZzVG9Qb3B1cCIsInNob3dGYXZBZGRlZCIsImFkZENsYXNzIiwiZmluZCIsImhpZGUiLCJkZWxGYXYiLCJpblBvcHVwIiwiZmlsdGVyIiwic2hvd0ZhdlBvcHVwIiwicmVtb3ZlQ2xhc3MiLCJzaG93IiwidG9nZ2xlRmF2Iiwic29tZSIsImNyZWF0ZUZhdlJvd3MiLCJqb2JzIiwiY3JlYXRlRmF2Um93IiwieCIsInQiLCJoZWFkaW5nIiwiY3JlYXRlVGltZVRhZyIsImRhdGVfZW5kcyIsImNyZWF0ZU5vRmF2cyIsInRhZ1R5cGUiLCJ0YWdUeHQiLCJwbGFpblR4dCIsImRhdGVFbmRzIiwiRGF0ZSIsImRheXNMZWZ0IiwiZGF0ZUZvcm1hdHRlZCIsImdldERhdGUiLCJnZXRNb250aCIsInRlbXBsYXRlIiwiaGlkZU51bWJlciIsInBhcmVudCIsInNob3dOdW1iZXIiLCJoaWRlQWN0aW9ucyIsInNob3dBY3Rpb25zIiwiY3NzIiwiY2xlYXJUaW1lb3V0Iiwid2lkdGgiLCJvZmZzZXQiLCJvdXRlckhlaWdodCIsInRyYW5zZm9ybSIsInBvc2l0aW9uIiwib3V0ZXJXaWR0aCIsInBhcmVudHMiLCJ0ZXh0Iiwic2V0VGltZW91dCIsImh0bWwiLCJzbGljZSIsInRvZ2dsZUZhdlBvcHVwIiwidG9nZ2xlIiwicG9zaXRpb25GYXZQb3B1cCIsInVwZGF0ZUZhdm9yaXRlRWxlbWVudHNTdGF0ZSIsImVhY2giLCJ0aGlzIiwibWFrZVN0aWNreSIsIiRub3QiLCIkcGFyZW50IiwibWFrZU5vdFN0aWNreSIsImhhbmRsZURhdGEiLCJzdGlja3lGaWx0ZXJzIiwiJHN0aWNreSIsInNjcm9sbFRvcCIsInNjcm9sbCIsInJlc2l6ZSIsImNsaWNrIiwiZSIsInByZXZlbnREZWZhdWx0IiwiYXR0ciIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInRhcmdldCIsImJsdXIiLCJkb2N1bWVudCIsImhhc0NsYXNzIiwicmVtb3ZlIiwicmVhZHkiLCJmYXZDb29raWUiXSwibWFwcGluZ3MiOiJBQUNBLElBbUNJQSxpQkFDQUMsYUFwQ0FDLGtCQUFvQiw0QkFDcEJDLFlBQWMsaUJBQ2RDLGlCQUFtQixRQUNuQkMsSUFBTUMsT0FBT0MsUUFJYkMsVUFBWUMsRUFBRSxpQkFDZEMsZUFBaUJELEVB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SyxXQUFhekIsRUFBRWtILE1BQU1jLEtBQUssTUFFaERGLEVBQUVHLDJCQUNGSCxFQUFFQyxpQkFFRnpELFVBQVV6QyxFQUFNTyxFQUFJcEMsRUFBRWtILE9BRXRCbEgsRUFBRThILEVBQUVJLFFBQVFDLE9BQ1puSSxFQUFFa0gsTUFBTWlCLFNBR1ZuSSxFQUFFb0ksVUFBVVAsTUFBTSxTQUFTQyxHQUN6QixJQUNJakcsRUFEQXVCLEVBQU1wRCxFQUFFOEgsRUFBRUksUUFRZCxHQUxLbEksRUFBRThILEVBQUVJLFFBQVExQixRQUFRLHNCQUFzQm5ELFFBQVdyRCxFQUFFOEgsRUFBRUksUUFBUTFCLFFBQVEsaUJBQWlCbkQsU0FDN0Z0RCxVQUFVZ0UsT0FDVjlELGVBQWU4RCxRQUdiWCxFQUFJaUYsU0FBUyxvQkFBc0JqRixFQUFJd0MsU0FBU3lDLFNBQVMsbUJBQW9CLENBRS9FLEtBREF4RyxFQUFPdUIsRUFBSTNCLEtBQUssYUFDTCxPQUlYLE9BRkFxRyxFQUFFQyxpQkFFRTNFLEVBQUlpRixTQUFTLG1CQUFxQmpGLEVBQUl3QyxTQUFTeUMsU0FBUyx1QkFDMURyRSxPQUFPbkMsSUFJVG1DLE9BQU9uQyxHQUFNLElBQ04sR0FHVCxHQUFJdUIsRUFBSWlGLFNBQVMsNEJBQThCakYsRUFBSXdDLFNBQVN5QyxTQUFTLDJCQUE0QixDQUUvRixLQURBeEcsRUFBT3VCLEVBQUkzQixLQUFLLGFBQWUyQixFQUFJd0MsU0FBU25FLEtBQUssYUFDdEMsT0FFWHFHLEVBQUVDLGlCQUNGL0QsT0FBT25DLEdBRVB1QixFQUFJb0QsUUFBUSxZQUFZOEIsWUFNNUJ0SSxFQUFFb0ksVUFBVUcsTUFBTSxXQUNoQkMsVUFBWTVJLElBQU0sS0FBT3NCLGVBQ3pCTSxXQUFXZ0gsV0FBV2pGLEtBQUtnRSxZQUMzQkMsY0FBYzlHLGVBQWdCQyxrQkFBbUJELGVBQWVrRiIsImZpbGUiOiJmYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb25zdGFudHNcbnZhciBGQVZPUklURVNfQVBJX1VSTCA9ICcvZHRhY2NvdW50cy9mYXZvcml0ZV9qb2JzJztcbnZhciBKT0JfQVBJX1VSTCA9ICcvdHlvcGFpa2F0L3R5byc7XG52YXIgRkFWT1JJVEVTX0NPT0tJRSA9ICdkdGZhdic7XG52YXIgVUlEID0gd2luZG93LlVTRVJfSUQ7XG5cblxuLy8gRE9NIEVsZW1lbnRzXG52YXIgJGZhdlBvcHVwID0gJCgnLmpzLWZhdi1wb3B1cCcpO1xudmFyICRmYXZQb3B1cEFycm93ID0gJCgnLmpzLWZhdi1wb3B1cC1hcnJvdycpO1xudmFyICRmYXZQb3B1cENvbnRlbnQgPSAkKCcuanMtZmF2LXBvcHVwX19qb2JlbnRyaWVzJyk7XG52YXIgJGZhdlBvcHVwVG9nZ2xlID0gJCgnLmpzLXNob3ctZmF2LXBvcHVwJyk7XG52YXIgJGZhdlNhdmUgPSAkKCcuanMtc2F2ZS1mYXZvcml0ZScpO1xudmFyICRmYXZOdW1iZXIgPSAkKCcuanMtZmF2LW51bWJlcicpO1xudmFyICRmYXZBY3Rpb25zID0gJCgnLmpzLWZhdi1hY3Rpb25zJyk7XG52YXIgJGZhdkFkZGVkID0gJCgnLmpzLWZhdi1hZGRlZCcpO1xudmFyICRmYXZBZGRlZFRpdGxlID0gJCgnLmpzLWZhdi1hZGRlZC10aXRsZScpO1xudmFyICRmYXZGdWxsQWxlcnQgPSAkKCcuanMtZmF2LWZ1bGwtYWxlcnQnKTtcbnZhciAkc3RpY2t5RmlsdGVycyA9ICQoJy5qcy1zdGlja3ktZmlsdGVycycpO1xudmFyICRub3RTdGlja3lGaWx0ZXJzID0gJCgnLmpzLW5vdC1zdGlja3ktZmlsdGVycycpO1xuXG5cbi8vIFN0YXRlXG52YXIgRkFWT1JJVEVTID0gW107XG52YXIgcG9wdXBPZmZzZXRzID0ge1xuICBhcnJvdzoge1xuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwXG4gIH0sXG4gIHBvcHVwOiB7XG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gIH1cbn1cblxuLy8gVGltZW91dHNcbnZhciBoaWRlRmF2RnVsbEFsZXJ0O1xudmFyIGhpZGVGYXZBZGRlZDtcblxuXG4vLyBDb29raWVcbmZ1bmN0aW9uIGdldEZhdkNvb2tpZSgpIHtcbiAgcmV0dXJuIGdldENvb2tpZShGQVZPUklURVNfQ09PS0lFKSB8fCBbXTtcbn1cblxuZnVuY3Rpb24gc2V0RmF2Q29va2llKGZhdnMpIHtcbiAgc2V0Q29va2llKEZBVk9SSVRFU19DT09LSUUsIGZhdkFyclRvU3RyKGZhdnMpLCAxKTtcbn1cblxuXG4vLyBBamF4XG5mdW5jdGlvbiBnZXRGYXZEYXRhKGZhdnMpIHtcbiAgdmFyIGRhdGEgPSBmYXZzID8geyBpZHM6IGZhdnMgfSA6IHt9O1xuICByZXR1cm4gJC5nZXQoRkFWT1JJVEVTX0FQSV9VUkwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBhZGRGYXZEQihzbHVnKSB7IHJldHVybiAkLmdldChKT0JfQVBJX1VSTCArICcvJyArIHNsdWcgKyAnL2xpc2FhX3N1b3Npa2tlaWhpbicpOyB9XG5mdW5jdGlvbiBkZWxGYXZEQihzbHVnKSB7IHJldHVybiAkLnBvc3QoSk9CX0FQSV9VUkwgKyAnLycgKyBzbHVnICsgJy9wb2lzdGFfc3Vvc2lrZWlzdGEnKTsgfVxuXG5cbi8vIEZvcm1hdFxuZnVuY3Rpb24gZmF2QXJyVG9TdHIoZmF2cykge1xuICBpZiAoIWZhdnMpIHJldHVybjtcbiAgcmV0dXJuIGZhdnMucmVkdWNlKGZ1bmN0aW9uKGEsIGMsIGkpIHtcbiAgICByZXR1cm4gYSArIChpID8gJywnIDogJycpICsgYy5pZDsgLy8gLCBvbmx5IGlmIG5vdCBmaXJzdFxuICB9LCAnJyk7XG59XG5cbmZ1bmN0aW9uIHRpbWVEaWZmKGQxLCBkMiwgdW5pdCkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICdtaWxsaXNlY29uZHMnOlxuICAgICAgbXNUb1VuaXQgPSAxO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2Vjb25kcyc6XG4gICAgICBtc1RvVW5pdCA9IDEwMDA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdtaW51dGVzJzpcbiAgICAgIG1zVG9Vbml0ID0gMTAwMCAqIDYwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnaG91cnMnOlxuICAgICAgbXNUb1VuaXQgPSAxMDAwICogNjAgKiA2MDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2RheXMnOlxuICAgICAgbXNUb1VuaXQgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbW9udGhzJzpcbiAgICAgIG1zVG9Vbml0ID0gMTAwMCAqIDYwICogNjAgKiAyNCAqIDMwO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAneWVhcnMnOlxuICAgICAgbXNUb1VuaXQgPSAxMDAwICogNjAgKiA2MCAqIDI0ICogMzY1O1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIG1zVG9Vbml0ID0gMTAwMCAqIDYwICogNjAgKiAyNDtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgcmV0dXJuIE1hdGguZmxvb3IoKGQyIC0gZDEpIC8gbXNUb1VuaXQpO1xufVxuXG5cbi8vIERhdGFMYXllclxuZnVuY3Rpb24gc2F2ZUZhdlRvRGF0YUxheWVyKG5hbWUpIHtcbiAgZGF0YUxheWVyLnB1c2goeyBldmVudDogJ3NhdmVGYXZvcml0ZScsIGNvbXBhbnlOYW1lOiBuYW1lIH0pO1xufVxuXG5mdW5jdGlvbiBkZWxldGVGYXZUb0RhdGFMYXllcigpIHtcbiAgZGF0YUxheWVyLnB1c2goeyBldmVudDogJ2RlbGV0ZUZhdm9yaXRlJyB9KTtcbn1cblxuXG4vLyBNYW5hZ2UgRmF2b3JpdGVzIHN0YXRlXG5mdW5jdGlvbiBzYXZlRmF2KHNsdWcsIGlkLCAkZWwpIHtcbiAgaWYgKFVJRCkgYWRkRmF2REIoc2x1Zyk7XG5cbiAgaWYgKCFVSUQgJiYgRkFWT1JJVEVTLmxlbmd0aCA+PSA1KSB7XG4gICAgc2hvd0ZhdkZ1bGxBbGVydCgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGdldEZhdkRhdGEoaWQpLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgIHNhdmVGYXZUb0RhdGFMYXllcihkYXRhLnJlc3VsdHNbMF0uY29tcGFueV9uYW1lKTtcbiAgICBGQVZPUklURVMudW5zaGlmdChkYXRhLnJlc3VsdHNbMF0pO1xuICAgIHNldEZhdkNvb2tpZShGQVZPUklURVMpO1xuICAgIGZhdnNUb1BvcHVwKEZBVk9SSVRFUyk7XG4gICAgc2hvd0ZhdkFkZGVkKGRhdGEucmVzdWx0c1swXSwgJGVsKTtcbiAgICAkZWwuYWRkQ2xhc3MoJ2pvYi1ib3hfX2ljb24tLWFjdGl2ZScpO1xuICAgICRlbC5maW5kKCcuaWNvbnNfX2xhYmVsJykuaGlkZSgpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVsRmF2KHNsdWcsIGluUG9wdXApIHtcbiAgaWYgKFVJRCkgZGVsRmF2REIoc2x1Zyk7XG5cbiAgZGVsZXRlRmF2VG9EYXRhTGF5ZXIoKTtcblxuICB2YXIgJGVsID0gJCgnW2RhdGEtam9iLXNsdWc9XCInICsgc2x1ZyArICdcIl0nKTtcblxuICBGQVZPUklURVMgPSBGQVZPUklURVMuZmlsdGVyKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIHNsdWcgIT0gYy5zbHVnIH0pO1xuXG4gIHNldEZhdkNvb2tpZShGQVZPUklURVMpO1xuICBmYXZzVG9Qb3B1cChGQVZPUklURVMpO1xuICBpZiAoaW5Qb3B1cCkgc2hvd0ZhdlBvcHVwKCk7XG5cbiAgaWYgKCRlbCkge1xuICAgICRlbC5yZW1vdmVDbGFzcygnam9iLWJveF9faWNvbi0tYWN0aXZlJyk7XG4gICAgJGVsLmZpbmQoJy5pY29uc19fbGFiZWwnKS5zaG93KCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdG9nZ2xlRmF2KHNsdWcsIGlkLCAkZWwpIHtcbiAgRkFWT1JJVEVTLnNvbWUoZnVuY3Rpb24oYykgeyByZXR1cm4gYy5zbHVnID09IHNsdWc7IH0pID8gZGVsRmF2KHNsdWcpIDogc2F2ZUZhdihzbHVnLCBpZCwgJGVsKTtcbn1cblxuXG4vLyBUZW1wbGF0aW5nXG5mdW5jdGlvbiBjcmVhdGVGYXZSb3dzKGpvYnMpIHsgcmV0dXJuIGpvYnMucmVkdWNlKGZ1bmN0aW9uKGEsIGMpIHsgcmV0dXJuIGEgKyBjcmVhdGVGYXZSb3coYykgfSwgJycpIH1cbmZ1bmN0aW9uIGNyZWF0ZUZhdlJvdyh4KSB7XG4gIHZhciB1cmwgPSAnL3R5b3BhaWthdC90eW8vJyArIHguc2x1ZztcblxuICB2YXIgdCA9ICcnO1xuICB0ICs9ICAnPGEgY2xhc3M9XCJsaXN0IGxpc3QtLXNpbXBsZV9faXRlbSBmYXYtcG9wdXBfX2pvYmVudHJ5XCIgaHJlZj1cIicgKyB1cmwgKyAnP2NsaWNrX2Zyb209ZmF2X2JveFwiIGRhdGEtam9iLWlkPVwiJyArIHguaWQgKyAnXCIgZGF0YS1qb2Itc2x1Zz1cIicgKyB4LnNsdWcgKyAnXCI+JztcbiAgdCArPSAgICAnPHNwYW4+JyArIHguaGVhZGluZyArICc8L3NwYW4+JztcbiAgdCArPSAgICAnPHNwYW4gY2xhc3M9XCJmYXYtcG9wdXBfX2pvYmVudHJ5X19jb21wYW55XCI+JyArIGNyZWF0ZVRpbWVUYWcoeC5kYXRlX2VuZHMpICsgeC5jb21wYW55X25hbWUgKyAnPC9zcGFuPic7XG4gIHQgKz0gICAgJzxkaXYgY2xhc3M9XCJmYXYtcG9wdXBfX2pvYmVudHJ5X19kZWxldGVfX3dyYXBwZXIganMtZGVsLWZhdm9yaXRlXCI+PGRpdiBjbGFzcz1cImZhdi1wb3B1cF9fam9iZW50cnlfX2RlbGV0ZVwiIGRhdGEtam9iLWlkPVwiJyArIHguaWQgKyAnXCIgZGF0YS1qb2Itc2x1Zz1cIicgKyB4LnNsdWcgKyAnXCI+PC9kaXY+PC9kaXY+JztcbiAgdCArPSAgJzwvYT4nO1xuXG4gIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb0ZhdnMoKSB7XG4gIHZhciB0ID0gJzxwIGNsYXNzPVwiZmF2LXBvcHVwX19lbXB0eVwiPkh1cHMhIFNpbnVsbGEgZWkgb2xlIHZpZWzDpCBsYWlua2FhbiBzdW9zaWtrZWphLiBUYWxsZW5uYSBuaWl0w6QgbmFwYXV0dGFtYWxsYSBzeWTDpG50w6QgaGFsdWFtYXNpIGlsbW9pdHVrc2VuIGtvaGRhbHRhLjwvcD4nO1xuICBpZiAoIVVJRCkge1xuICAgIHQgKz0gICc8ZGl2IGNsYXNzPVwiZmF2LXBvcHVwX19lbXB0eVwiPic7XG5cbiAgICAvLyBUT0RPOiBGaW5kIGEgd2F5IHRvIHVzZSBkamFuZ28gdGVtcGxhdGUgdGFnIGZvciB0aGUgc3JjIGF0dHJpYnV0ZSBoZXJlLiBQcm9iYWJseSBzaG91bGQgY3JlYXRlIHRoZSBlbGVtZW50IHdpdGhpbiB0aGUgLmh0bWwgZmlsZSBhbmQganVzdCBzaG93IGFuZCBoaWRlIHRoaW5nc1xuICAgIHQgKz0gICAgJzxkaXYgY2xhc3M9XCJmYXYtcG9wdXBfX2FjdGlvbnMgMS8xIGdyaWRfX2NlbGxcIj48ZGl2IGNsYXNzPVwiZmF2LXBvcHVwX193YXJuaW5nXCI+PGltZyBjbGFzcz1cImZhdi1wb3B1cF9fd2FybmluZ19faWNvblwiIHNyYz1cImh0dHBzOi8vc2t5aG9vZC1kdXVuaXRvcmk1LnMzLmFtYXpvbmF3cy5jb20vc3RhdGljL3dlYi9pbWFnZXMvaWNfZmF2b3VyaXRlLWFsZXJ0LnN2Z1wiPjxwIGNsYXNzPVwiZmF2LXBvcHVwX193YXJuaW5nX190ZXh0XCI+U3Vvc2lra2VqYXNpIGVpIHRhbGxlbm5ldGEhIFJla2lzdGVyw7ZpZHksIG5paW4gdm9pdCBwYWxhdGEgbmlpaGluIHZpZWzDpCBtecO2aGVtbWluLjwvcD48L2Rpdj48L2Rpdj4nO1xuICAgIHQgKz0gICAgJzxkaXYgY2xhc3M9XCJmYXYtcG9wdXBfX2J1dHRvbnNcIj48YSBocmVmPVwiL2R0YWNjb3VudHMvcmVnaXN0ZXI/cGFsdmVsdT1kdGFjY291bnRzXCIgY2xhc3M9XCJidG4gYnRuLS1zdWNjZXNzIGZhdi1wb3B1cF9fYnV0dG9uc19fYnRuXCI+UmVraXN0ZXLDtmlkeTwvYT48YSBocmVmPVwiL2R0YWNjb3VudHMvbG9naW5cIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZSBidG4tb3V0bGluZS0tc3VjY2VzcyBmYXYtcG9wdXBfX2J1dHRvbnNfX2J0blwiPktpcmphdWR1PC9hPjwvZGl2Pic7XG4gICAgdCArPSAgJzwvZGl2Pic7XG4gIH1cblxuICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVGltZVRhZyhkYXRlX2VuZHMpIHtcbiAgdmFyIGRhdGVFbmRzID0gbmV3IERhdGUoZGF0ZV9lbmRzKTtcbiAgdmFyIGRheXNMZWZ0ID0gdGltZURpZmYobmV3IERhdGUoKSwgZGF0ZUVuZHMsICdkYXlzJyk7XG4gIHZhciBkYXRlRm9ybWF0dGVkID0gZGF0ZUVuZHMuZ2V0RGF0ZSgpICsgJy4nICsgKGRhdGVFbmRzLmdldE1vbnRoKCkgKyAxKTtcbiAgdmFyIHRlbXBsYXRlID0gJyc7XG4gIHZhciB0YWdUeXBlO1xuICB2YXIgdGFnVHh0O1xuICB2YXIgcGxhaW5UeHQ7XG5cbiAgaWYgKGRheXNMZWZ0IDwgMCkge1xuICAgIHBsYWluVHh0ID0gJ1DDpMOkdHR5bnl0ICcgKyBkYXRlRm9ybWF0dGVkO1xuICB9IGVsc2UgaWYgKGRheXNMZWZ0ID09PSAwKSB7XG4gICAgdGFnVHlwZSA9ICdlcnJvcic7XG4gICAgdGFnVHh0ID0gJ0hha3UgcMOkw6R0dHl5IHTDpG7DpMOkbic7XG4gIH0gZWxzZSBpZiAoZGF5c0xlZnQgPT09IDEpIHtcbiAgICB0YWdUeXBlID0gJ2Vycm9yJztcbiAgICB0YWdUeHQgPSAnMSBww6RpdsOkIGrDpGxqZWxsw6QnO1xuICB9IGVsc2UgaWYgKGRheXNMZWZ0IDw9IDUpIHtcbiAgICB0YWdUeXBlID0gJ2Vycm9yJztcbiAgICB0YWdUeHQgPSBkYXlzTGVmdCArICcgcMOkaXbDpMOkIGrDpGxqZWxsw6QnXG4gIH0gZWxzZSBpZiAoZGF5c0xlZnQgPD0gMzEpIHtcbiAgICBwbGFpblR4dCA9ICdQw6TDpHR0eXkgJyArIGRhdGVGb3JtYXR0ZWQ7XG4gIH0gZWxzZSB7XG4gICAgcGxhaW5UeHQgPSAnVG9pc3RhaXNla3NpIHZvaW1hc3NhJztcbiAgfVxuXG4gIGlmICh0YWdUeHQpIHtcbiAgICB0ZW1wbGF0ZSArPSAnPHNwYW4gY2xhc3M9XCJ0YWcgdGFnLS0nICsgdGFnVHlwZSArICdcIj4nO1xuICAgIHRlbXBsYXRlICs9ICAgdGFnVHh0O1xuICAgIHRlbXBsYXRlICs9ICc8L3NwYW4+JztcbiAgfSBlbHNlIGlmIChwbGFpblR4dCkge1xuICAgIHRlbXBsYXRlICs9ICc8c3Bhbj4nICsgcGxhaW5UeHQgKyAnIC0gPC9zcGFuPic7XG4gIH1cblxuICByZXR1cm4gdGVtcGxhdGU7XG59XG5cblxuXG5mdW5jdGlvbiBoaWRlTnVtYmVyKCkge1xuICAkZmF2TnVtYmVyLnBhcmVudCgpLmhpZGUoKTtcbiAgJGZhdk51bWJlci5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZmF2LWljb24tLXdpdGgtY2lyY2xlJyk7XG59XG5mdW5jdGlvbiBzaG93TnVtYmVyKCkge1xuICAkZmF2TnVtYmVyLnBhcmVudCgpLnNob3coKTtcbiAgJGZhdk51bWJlci5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcygnZmF2LWljb24tLXdpdGgtY2lyY2xlJyk7XG59XG5cbmZ1bmN0aW9uIGhpZGVBY3Rpb25zKCkgeyAkZmF2QWN0aW9ucy5oaWRlKCk7IH1cbmZ1bmN0aW9uIHNob3dBY3Rpb25zKCkgeyAkZmF2QWN0aW9ucy5zaG93KCk7IH1cblxuZnVuY3Rpb24gc2hvd0ZhdkFkZGVkKGRhdGEsICRlbCkge1xuICB2YXIgY3NzID0ge307XG5cbiAgaWYgKGhpZGVGYXZBZGRlZCkgY2xlYXJUaW1lb3V0KGhpZGVGYXZBZGRlZCk7XG5cbiAgaWYgKCQod2luZG93KS53aWR0aCgpID4gMTAyNCkge1xuICAgIGNzcy50b3AgPSAkZWwub2Zmc2V0KCkudG9wIC0gJGZhdkFkZGVkLm91dGVySGVpZ2h0KCkgLyAyICsgNDA7XG4gICAgY3NzLnRyYW5zZm9ybSA9ICdpbml0aWFsJztcbiAgICBjc3MucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXG4gICAgaWYgKCRlbC5vZmZzZXQoKS5sZWZ0ICsgJGZhdkFkZGVkLm91dGVyV2lkdGgoKSA+ICQod2luZG93KS53aWR0aCgpICYmICRlbC5wYXJlbnRzKCcuZ3JpZCcpWzBdKSB7XG4gICAgICBjc3MubGVmdCA9ICQoJGVsLnBhcmVudHMoJy5ncmlkJylbMF0pLm9mZnNldCgpLmxlZnQgLSAkZmF2QWRkZWQub3V0ZXJXaWR0aCgpIC0gNjA7IC8vIE1hZ2ljIG51bWJlciBmb3IgbWFyZ2luXG4gICAgICAkZmF2QWRkZWQuYWRkQ2xhc3MoJ2Fycm93LXJpZ2h0Jyk7XG4gICAgICAkZmF2QWRkZWQucmVtb3ZlQ2xhc3MoJ2Fycm93LWxlZnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGZhdkFkZGVkLnJlbW92ZUNsYXNzKCdhcnJvdy1yaWdodCcpO1xuICAgICAgJGZhdkFkZGVkLmFkZENsYXNzKCdhcnJvdy1sZWZ0Jyk7XG4gICAgICBjc3MubGVmdCA9ICRlbC5vZmZzZXQoKS5sZWZ0ICsgJGVsLm91dGVyV2lkdGgoKSArIDUwOyAvLyBNYWdpYyBudW1iZXIgZm9yIG1hcmdpblxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjc3MudG9wID0gMDtcbiAgICBjc3MubGVmdCA9ICc1MCUnO1xuICAgIGNzcy50cmFuc2Zvcm0gPSAndHJhbnNsYXRlWCgtNTAlKSc7XG4gICAgY3NzLnBvc2l0aW9uID0gJ2ZpeGVkJztcbiAgfVxuXG5cbiAgJGZhdkFkZGVkVGl0bGUudGV4dChkYXRhLmhlYWRpbmcpO1xuICAkZmF2QWRkZWQuY3NzKGNzcyk7XG4gICRmYXZBZGRlZC5yZW1vdmVDbGFzcygnZmF2LWFkZGVkLS1oaWRkZW4nKTtcblxuICBoaWRlRmF2QWRkZWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyAkZmF2QWRkZWQuYWRkQ2xhc3MoJ2Zhdi1hZGRlZC0taGlkZGVuJyk7IH0sIDYwMDApO1xufVxuXG5cbi8vIERPTVxuZnVuY3Rpb24gZmF2c1RvUG9wdXAoZmF2cykge1xuICBpZiAoIWZhdnMubGVuZ3RoIHx8IGZhdnMubGVuZ3RoIDw9IDApIHtcbiAgICAkZmF2UG9wdXBDb250ZW50Lmh0bWwoY3JlYXRlTm9GYXZzKCkpO1xuICAgIGhpZGVOdW1iZXIoKTtcbiAgICBoaWRlQWN0aW9ucygpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChVSUQpIHtcbiAgICAkZmF2TnVtYmVyLmh0bWwoZmF2cy5sZW5ndGgpO1xuICAgICRmYXZOdW1iZXIucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2Zhdi1pY29uX19jaXJjbGUtLWVycm9yJyk7XG4gIH0gZWxzZSB7XG4gICAgJGZhdk51bWJlci5odG1sKCc8c3ZnIHdpZHRoPVwiMnB4XCIgaGVpZ2h0PVwiOXB4XCIgdmlld0JveD1cIjAgMCAyIDlcIiB2ZXJzaW9uPVwiMS4xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiPjxnIGlkPVwiUGFnZS0xXCIgc3Ryb2tlPVwibm9uZVwiIHN0cm9rZS13aWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGZpbGwtcnVsZT1cImV2ZW5vZGRcIj48ZyBpZD1cIkdyb3VwLTVcIiBmaWxsPVwiI0ZGRkZGRlwiIGZpbGwtcnVsZT1cIm5vbnplcm9cIj48cG9seWdvbiBpZD1cIlBhdGhcIiBwb2ludHM9XCIwIC0zLjY0NTk3MjQxZS0xMyAwIDUuNjcgMiA1LjY3IDIgLTMuNjQ1OTcyNDFlLTEzXCI+PC9wb2x5Z29uPjxwb2x5Z29uIGlkPVwiUGF0aFwiIHBvaW50cz1cIjAgNy4zOCAwIDkgMiA5IDIgNy4zOFwiPjwvcG9seWdvbj48L2c+PC9nPjwvc3ZnPicpO1xuICAgICRmYXZOdW1iZXIucGFyZW50KCkuYWRkQ2xhc3MoJ2Zhdi1pY29uX19jaXJjbGUtLWVycm9yJyk7XG4gIH1cblxuICBzaG93QWN0aW9ucygpO1xuICBzaG93TnVtYmVyKCk7XG4gICRmYXZQb3B1cENvbnRlbnQuaHRtbChjcmVhdGVGYXZSb3dzKGZhdnMuc2xpY2UoMCwgNSkpKTtcbiAgcmV0dXJuO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVGYXZQb3B1cCgkZWwpIHtcbiAgJGZhdlBvcHVwLnRvZ2dsZSgpO1xuICBpZiAoJCh3aW5kb3cpLndpZHRoID49IDEwMjQpICRmYXZQb3B1cEFycm93LnRvZ2dsZSgpO1xuICBwb3NpdGlvbkZhdlBvcHVwKCRlbCk7XG59XG5cbmZ1bmN0aW9uIHNob3dGYXZQb3B1cCgkZWwpIHtcbiAgJGZhdlBvcHVwLnNob3coKTtcbiAgaWYgKCQod2luZG93KS53aWR0aCA+PSAxMDI0KSAkZmF2UG9wdXBBcnJvdy5zaG93KCk7XG4gIHBvc2l0aW9uRmF2UG9wdXAoJGVsKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlRmF2b3JpdGVFbGVtZW50c1N0YXRlKCkge1xuICAkZmF2U2F2ZS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICRlbCA9ICQodGhpcyk7XG4gICAgaWYgKEZBVk9SSVRFUy5zb21lKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIGMuc2x1ZyA9PT0gJGVsLmRhdGEoJ2pvYi1zbHVnJykgfSkpIHtcbiAgICAgICRlbC5hZGRDbGFzcygnam9iLWJveF9faWNvbi0tYWN0aXZlJyk7XG4gICAgICAkZWwuZmluZCgnLmljb25zX19sYWJlbCcpLmhpZGUoKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwb3NpdGlvbkZhdlBvcHVwKCRlbCkge1xuICAvLyBBbGwgbWFnaWMgbnVtYmVycyBhcmUgYmFzZWQgb24gZXllYmFsbGVkIHBsYWNlbWVudFxuXG4gIGlmICgkZWwgJiYgJGVsLmxlbmd0aCkge1xuICAgIHBvcHVwT2Zmc2V0cy5hcnJvdy50b3AgPSAkZWwub2Zmc2V0KCkudG9wICsgJGVsLm91dGVySGVpZ2h0KHRydWUpIC0gMTA7XG4gICAgcG9wdXBPZmZzZXRzLmFycm93LmxlZnQgPSAkZWwub2Zmc2V0KCkubGVmdCArICRlbC5vdXRlcldpZHRoKCkgLyAyIC0gMTA7XG5cbiAgICBwb3B1cE9mZnNldHMucG9wdXAudG9wID0gcG9wdXBPZmZzZXRzLmFycm93LnRvcCArIDc7XG5cbiAgICAvLyBQbGFjZSBwb3B1cCBob3Jpem9udGFsbHlcbiAgICBwb3B1cE9mZnNldHMucG9wdXAubGVmdCA9ICgkKHdpbmRvdykud2lkdGgoKSA8PSAxMDI0KSA/XG4gICAgICAwIDogLy8gRnJvbSBsZWZ0IHRvIHJpZ2h0IG9uIG1vYmlsZVxuICAgICAgKHBvcHVwT2Zmc2V0cy5hcnJvdy5sZWZ0ICsgJGZhdlBvcHVwLndpZHRoKCkgPiAkKHdpbmRvdykud2lkdGgoKSkgPyAvLyBVbmRlciBhcnJvdyBvbiBkZXNrXG4gICAgICAgIHBvcHVwT2Zmc2V0cy5hcnJvdy5sZWZ0IC0gJGZhdlBvcHVwLndpZHRoKCkgOiAvLyBUbyB0aGUgbGVmdCBpZiBvdGhlcndpc2Ugd291bGQgZ28gYmV5b25kIHNjcmVlblxuICAgICAgICBwb3B1cE9mZnNldHMuYXJyb3cubGVmdCAtIDE0OyAvLyBUbyB0aGUgcmlnaHRcbiAgfVxuXG4gICRmYXZQb3B1cEFycm93Lm9mZnNldChwb3B1cE9mZnNldHMuYXJyb3cpO1xuICAgICAgICRmYXZQb3B1cC5vZmZzZXQocG9wdXBPZmZzZXRzLnBvcHVwKTtcbn1cblxuZnVuY3Rpb24gc2hvd0ZhdkZ1bGxBbGVydCgpIHtcbiAgdmFyICRlbCA9ICQoJy5qcy1tb2RhbC1vdmVybGF5LS1mYXYnKTtcbiAgJGZhdkZ1bGxBbGVydC5zaG93KCk7XG4gICRlbC5zaG93KCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VTdGlja3koJGVsLCAkbm90LCAkcGFyZW50KSB7XG4gIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI0KSByZXR1cm47XG4gICRlbC5zaG93KCk7XG4gICRub3QuaGlkZSgpO1xuICAkcGFyZW50LnJlbW92ZUNsYXNzKCdncmlkLXNhbmRib3gtLWJhY2tncm91bmQtLW1vYmlsZScpO1xuICAkcGFyZW50LmFkZENsYXNzKCdzZWFyY2gtc3RpY2t5X193cmFwcGVyJyk7XG4gICRwYXJlbnQuY3NzKHtwb3NpdGlvbjogJ2ZpeGVkJ30pO1xuICAvLyAkcGFyZW50Lm5leHQoKS5jc3MoJ21hcmdpbi10b3AnLCAkZWwucGFyZW50KCkub3V0ZXJIZWlnaHQoKSk7XG59XG5cbmZ1bmN0aW9uIG1ha2VOb3RTdGlja3koJGVsLCAkbm90LCAkcGFyZW50KSB7XG4gIGlmICgkKHdpbmRvdykud2lkdGgoKSA+PSAxMDI0KSByZXR1cm47XG4gICRlbC5oaWRlKCk7XG4gICRub3Quc2hvdygpO1xuICAkcGFyZW50LmFkZENsYXNzKCdncmlkLXNhbmRib3gtLWJhY2tncm91bmQtLW1vYmlsZScpO1xuICAkcGFyZW50LnJlbW92ZUNsYXNzKCdzZWFyY2gtc3RpY2t5X193cmFwcGVyJyk7XG4gICRwYXJlbnQuY3NzKHtwb3NpdGlvbjogJ3JlbGF0aXZlJ30pO1xuICAvLyAkcGFyZW50Lm5leHQoKS5jc3MoJ21hcmdpbi10b3AnLCAwKTtcbn1cblxuXG5cbi8vIEV2ZW50IGhhbmRsZXJzXG5mdW5jdGlvbiBoYW5kbGVEYXRhKGQxKSB7XG4gIEZBVk9SSVRFUyA9IGQxLnJlc3VsdHM7XG4gIGZhdnNUb1BvcHVwKEZBVk9SSVRFUyk7XG4gIHNldEZhdkNvb2tpZShGQVZPUklURVMpO1xuICB1cGRhdGVGYXZvcml0ZUVsZW1lbnRzU3RhdGUoKTtcbn1cblxuZnVuY3Rpb24gc3RpY2t5RmlsdGVycygkc3RpY2t5LCAkbm90LCAkcGFyZW50KSB7XG4gIGlmICghJHN0aWNreSB8fCAhJG5vdCkgcmV0dXJuO1xuXG4gIHZhciBzY3JvbGxPZmZzZXQgPSAxMTA7XG5cbiAgaWYgKCQod2luZG93KS5zY3JvbGxUb3AoKSA+IHNjcm9sbE9mZnNldCkge1xuICAgIG1ha2VTdGlja3koJHN0aWNreSwgJG5vdCwgJHBhcmVudCk7XG4gIH1cblxuICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gc2Nyb2xsT2Zmc2V0KSB7XG4gICAgICBtYWtlU3RpY2t5KCRzdGlja3ksICRub3QsICRwYXJlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1ha2VOb3RTdGlja3koJHN0aWNreSwgJG5vdCwgJHBhcmVudCk7XG4gIH0pO1xuXG4gICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID49IDEwMjQpIHtcbiAgICAgIG1ha2VOb3RTdGlja3koJHN0aWNreSwgJG5vdCwgJHBhcmVudCk7XG4gICAgfVxuICB9KVxufVxuXG5cblxuXG4vLyBFdmVudCBsaXN0ZW5lcnNcbiRmYXZQb3B1cFRvZ2dsZS5jbGljayhmdW5jdGlvbihlKSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgdG9nZ2xlRmF2UG9wdXAoJCh0aGlzKSk7XG59KTtcblxuJGZhdlNhdmUuY2xpY2soZnVuY3Rpb24oZSkge1xuICB2YXIgc2x1ZyA9ICQodGhpcykuZGF0YSgnam9iLXNsdWcnKTtcbiAgdmFyIGlkID0gJCh0aGlzKS5kYXRhKCdqb2ItaWQnKSB8fCAkKHRoaXMpLmF0dHIoJ2lkJyk7XG5cbiAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIHRvZ2dsZUZhdihzbHVnLCBpZCwgJCh0aGlzKSk7XG5cbiAgJChlLnRhcmdldCkuYmx1cigpO1xuICAkKHRoaXMpLmJsdXIoKTtcbn0pO1xuXG4kKGRvY3VtZW50KS5jbGljayhmdW5jdGlvbihlKSB7XG4gIHZhciAkZWwgPSAkKGUudGFyZ2V0KTtcbiAgdmFyIHNsdWc7XG5cbiAgaWYgKCEkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtc2hvdy1mYXYtcG9wdXAnKS5sZW5ndGggJiYgISQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1mYXYtcG9wdXAnKS5sZW5ndGgpIHtcbiAgICAkZmF2UG9wdXAuaGlkZSgpO1xuICAgICRmYXZQb3B1cEFycm93LmhpZGUoKTtcbiAgfVxuXG4gIGlmICgkZWwuaGFzQ2xhc3MoJ2pzLWRlbC1mYXZvcml0ZScpIHx8ICRlbC5wYXJlbnQoKS5oYXNDbGFzcygnanMtZGVsLWZhdm9yaXRlJykpIHtcbiAgICBzbHVnID0gJGVsLmRhdGEoJ2pvYi1zbHVnJyk7XG4gICAgaWYgKCFzbHVnKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoJGVsLmhhc0NsYXNzKCdqcy1mYXYtbm9wb3B1cCcpIHx8ICRlbC5wYXJlbnQoKS5oYXNDbGFzcygnanMtZmF2LW5vcG9wdXAnKSkge1xuICAgICAgZGVsRmF2KHNsdWcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlbEZhdihzbHVnLCB0cnVlKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJGVsLmhhc0NsYXNzKCdqcy1kZWwtZmF2b3JpdGUtb24tcGFnZScpIHx8ICRlbC5wYXJlbnQoKS5oYXNDbGFzcygnanMtZGVsLWZhdm9yaXRlLW9uLXBhZ2UnKSkge1xuICAgIHNsdWcgPSAkZWwuZGF0YSgnam9iLXNsdWcnKSB8fCAkZWwucGFyZW50KCkuZGF0YSgnam9iLXNsdWcnKTtcbiAgICBpZiAoIXNsdWcpIHJldHVybjtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBkZWxGYXYoc2x1Zyk7XG5cbiAgICAkZWwucGFyZW50cygnLmpvYi1ib3gnKS5yZW1vdmUoKTtcbiAgfVxufSk7XG5cblxuLy8gSW5pdFxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gIGZhdkNvb2tpZSA9IFVJRCA/IG51bGwgOiBnZXRGYXZDb29raWUoKTtcbiAgZ2V0RmF2RGF0YShmYXZDb29raWUpLmRvbmUoaGFuZGxlRGF0YSk7XG4gIHN0aWNreUZpbHRlcnMoJHN0aWNreUZpbHRlcnMsICRub3RTdGlja3lGaWx0ZXJzLCAkc3RpY2t5RmlsdGVycy5wYXJlbnQoKSk7XG59KTtcbiJdfQ==
