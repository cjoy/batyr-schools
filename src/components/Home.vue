<template>
  <div id="home">
    <md-toolbar>
      <img
        src="http://www.batyr.com.au/wp-content/uploads/batyr-logo-reg-blue.png"
        style="width: 40px;"
      />
    </md-toolbar>
    <div class="batyr-pane">
      <!-- StatsBox{start} -->
      <md-card class="stats-box">
        <md-content style="background-color: rgb(255, 131, 29);; color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>National statistics</h2>
          Help Seeking Rate: <span class="stat-val">23%</span><br>
          Young Australians: <span class="stat-val">2,988,390</span> (residents aged 15 to 24*)<br>
          Total number of schools: <span class="stat-val">4,177</span><br>
        </md-content>
        <md-content style="background-color: rgb(0, 104, 165); color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>Current batyr statistics</h2>
          Help seeking rate: <span class="stat-val">69%</span><br>
          Young Australians reached: <span class="stat-val">83,488</span><br>
          Number of schools visited: <span class="stat-val">232</span><br>
        </md-content>
        <md-content style="background-color: rgb(0, 165, 222);; color: white; width: 33.33%; min-height: 100%; padding: 20px">
         <h2>batyr 2022 target</h2>
            Help seeking rate: <span class="stat-val">75%</span><br>
            Young Australians reached: <span class="stat-val">1 Million</span><br>
            Number of schools visited: <span class="stat-val">1000+</span><br>
        </md-content>
      </md-card>
      <!-- StatsBox{end} -->
      <!-- SearchBox{start} -->
      <md-toolbar class="search-box">
        <div class="md-toolbar-row">
          <md-autocomplete
            v-model="schoolInput"
            :md-options="batyrIndexNames"
          >
            <label>Search by school name</label>
            <template slot="md-autocomplete-item" slot-scope="{ item, term }">
              <md-highlight-text :md-term="term">{{ item }}</md-highlight-text>
            </template>
            <template slot="md-autocomplete-empty" slot-scope="{ term }">
              No schools matching "{{ term }}" were found. <a target="_blank" href="http://www.batyr.com.au/school-programs/#wpcf7-f152-p97-o1">Click here</a> to request a visit!
            </template>
          </md-autocomplete>
          <md-button
            class="md-raised searchButton"
            @click="findSchool()"
          >
            Find School
          </md-button>
        </div>
      </md-toolbar>
      <!-- SearchBox{end} -->
      <!-- GoogleMap{start} -->
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
      <!-- GoogleMap{end} -->
      <!-- InfoBox{start} -->
      <md-card class="info-box">
        <div v-if="currSchool">
          <h1>{{currSchool.name}}</h1>
          <h3>{{currSchool.address}}</h3>
          <span v-if="currSchool.students_attended"><b>Students attended</b>: {{currSchool.students_attended}}<br /></span>
          <span v-if="currSchool.students_surveyed"><b>Students surveyed</b>: {{currSchool.students_surveyed}}<br /></span>
          <span v-if="currSchool.engagement"><b>Engagement</b>: {{currSchool.engagement}}<br /></span>
          <span v-if="currSchool.help_seeking"><b>Help seeking</b>: {{currSchool.help_seeking}}<br /></span>
        </div>
        <div v-if="!currSchool">
          <md-empty-state
            class="md-primary"
            md-label="Can't find your school?"
            md-description="batyr@school programs aim to remove the stigma around mental health and engage, educate and empower young people to reach out for support when they need it."
          >
            <md-button
              href="http://www.batyr.com.au/school-programs/#wpcf7-f152-p97-o1"
              target="_blank"
              class="md-raised md-primary"
            >
              Request a program at your school
            </md-button>
          </md-empty-state>
        </div>
      </md-card>
      <!-- InfoBox{end} -->
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
      schoolInput: null,
      batyrIndexNames: SchoolsData.map(school => school.name),
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
    clearPlace() {
      this.currPlace = null;
      this.currSchool = null;
    },
    formatDate(date) {
      return fecha.format(new Date(date), 'MMMM Do, YYYY');
    },
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
      SchoolsData.forEach(school => {
        if (school.name === this.schoolInput) {
          this.showSchool(school);
        }
      })
    },
  },
  async mounted() {
   loaded.then(()=>{
     this.googleMapsInitialized = true;
   });
  },
};
</script>

<style scoped>
/* Misc */
.stat-val {
  font-size: 1.4em;
}
/* Boxes */
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
  width: 1024px;
}
.batyr-pane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 30px;
}
/* Components */
.searchButton {
  height: 45px;
  padding: 10px;
}
.gmap-map {
  width: 1024px;
  height: 400px;
}
.md-card {
  min-height: 100px;
  width: 1024px;
}
</style>
