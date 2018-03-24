<template>
  <div id="home">
    <div class="batyr-pane">
      <md-card class="stats-box">
        <md-content style="background-color: #90C4A6; color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>National Rates</h2>
          Help Seeking Rate: <span class="stat-val">23%</span><br>
          Young Australians: <span class="stat-val">2,988,390</span> (residents aged 15 to 24*)<br>
          Schools in Australia: <span class="stat-val">4,177</span><br>
        </md-content>
        <md-content style="background-color: #079EF4; color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>Batyr Current</h2>
          Help seeking rate: <span class="stat-val">69%</span><br>
          Young Australians Reached: <span class="stat-val">83,488</span><br>
          Number of Schools: <span class="stat-val">232</span><br>
        </md-content>
        <md-content style="background-color: #28aefc; color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>Batyr 2022 TARGET</h2>
            Help seeking rate: <span class="stat-val">75%</span><br>
            Young Australians Reached: <span class="stat-val">1 Million</span><br>
            Number of Schools: <span class="stat-val">1000</span><br>
        </md-content>
      </md-card>
      <md-card class="search-box">
        <gmap-autocomplete
          v-if="googleMapsInitialized"
          class="searchBox"
          placeholder="Enter your school name"
          @place_changed="setPlace"
          @change="clearPlace()"
          :options="{
            componentRestrictions: {
              country: ['au'],
            },
          types: ['establishment']
        }">
        </gmap-autocomplete>
        <md-button
          class="md-raised md-primary searchButton"
          @click="findSchool()"
        >
          Find School
        </md-button>
      </md-card>
      <md-card>
        <gmap-map
          v-if="googleMapsInitialized"
          :center='currCoord'
          :zoom='zoomLevel'
          map-type-id='terrain'
          class='gmap-map'
        >
          <gmap-marker
            v-for="school in schools"
            :icon="icon"
            :key="school.id"
            :position="getCoordinates(school)"
            :clickable="true"
            @click="showSchool(school)"
          >
          </gmap-marker>
          <!-- <gmap-info-window
            v-if="currSchool"
            :position="getCoordinates(currSchool)"
          >
            {{currSchool}}
          </gmap-info-window> -->
        </gmap-map>
      </md-card>
      <md-card class="info-box">
        <div v-if="currSchool">
          <h1>{{currSchool.name}}</h1>
          <h3>{{currSchool.address}}</h3>
          <b>Event Type</b>: {{currSchool.event_type }}<br />
          <b>Visit Date</b>: {{parseDate(currSchool.start_time)}}<br />
          <b>Number of Visits</b>: {{currSchool.num_of_events_cohort}}<br />
          <b>Students attended</b>: {{currSchool.students_attended}}<br />
          <b>Students surveyed</b>: {{currSchool.students_surveyed}}<br />
          <b>Engagement</b>: {{currSchool.engagement}}<br />
          <b>Help seeking</b>: {{currSchool.help_seeking}}<br />
        </div>
        <div v-if="!currSchool">
          <md-empty-state
            class="md-primary"
            md-icon="done"
            md-label="Nothing in Done"
            md-description="Anything you mark done will be safely stored here.">
          </md-empty-state>
          <md-empty-state
            class="md-accent"
            md-rounded
            md-icon="alarm_off"
            md-label="Nothing in Reminders"
            md-description="Create a Reminder and it will show up here.">
          </md-empty-state>
        </div>
      </md-card>
      <small>
        <br>* Slade, T., et al., The mental health of Australians 2: Report on the 2007 national survey of mental health and wellbeing. 2009, Canberra, Australia: Department of Health and Ageing.
        <br>“Service use was lowest among the youngest age groups with less than one quarter of people having used services for mental health problems in the previous 12 months (23.3% aged 16-34 years).”
        <br>** <a href=" http://www.abs.gov.au/AUSSTATS/abs@.nsf/mediareleasesbyReleaseDate/AC02F0705E320F58CA25817C00016A47?OpenDocument">2016 Census - a ‘selfie’ of young people in Australia</a>
        <br>** <a href="http://www.abs.gov.au/ausstats/abs@.nsf/mf/4221.0">4221.0 - Schools, Australia, 2017</a>
      </small>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { loaded } from 'vue2-google-maps';
import fecha from 'fecha';
import SchoolsData from '../assets/data.json';
import MapMarker from '../assets/mapmarker.svg';

export default {
  name: 'Home',
  data() {
    return {
      icon: MapMarker,
      googleMapsInitialized: false,
      zoomLevel: 11,
      schools: SchoolsData,
      currPlace: null,
      currSchool: null,
      currCoord: { lat: -33.865143, lng: 151.209900 },
    }
  },
  methods: {
    getCoordinates (school) {
      if (!school) return;
      return { lng: school.longitude, lat: school.latitude }
    },
    zoomIn() {
      this.zoomLevel = 10;
      setTimeout(() => {
        this.zoomLevel = 17;
      }, 10);
    },
    showSchool(school) {
      this.currCoord = this.getCoordinates(school);
      this.currSchool = school;
      this.zoomIn();
    },
    findSchool() {
      this.zoomLevel = 17;
    },
    setPlace(place) {
      this.currPlace = place;
      let lng = place.geometry.location.lng();
      let lat = place.geometry.location.lat();
      this.currCoord = { lng, lat };
      this.zoomIn();
    },
    clearPlace() {
      this.currPlace = null;
      this.currSchool = null;
    },
    parseDate(date) {
      return fecha.format(new Date(date), 'MMMM Do, YYYY');
    },
  },
  async mounted() {
   loaded.then(()=>{
     this.googleMapsInitialized = true; // define this property in data
   });
 },
};
</script>

<style scoped>
.stat-val {
  font-size: 1.4em;
}
.stats-box {
  overflow: hidden;
  height: 200px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.info-box {
  min-height: 250px;
  padding: 20px;
}
.search-box {
  overflow: hidden;
  padding: 30px;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.searchBox {
  border-radius: 5px;
  height: 45px;
  width: 830px;
  color: black;
  padding: 20px;
}
.searchButton {
  height: 45px;
  padding: 10px;
}
.gmap-map {
  width: 1024px;
  height: 400px;
}
.batyr-pane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px;
}
.md-card {
  min-height: 100px;
  width: 1024px;
  margin-bottom: 20px;
}
</style>
