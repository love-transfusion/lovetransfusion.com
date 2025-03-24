'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import useDeviceSize from '@/app/hooks/useDeviceSize'
import useGetAnalyticsCountryPathTotal from '@/app/hooks/this-website-only/useGetAnalyticsCountryPathTotal'
import { registerMap } from 'echarts/core'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const effectScatterData = [
  { name: 'Andorra', value: [1.601554, 42.546245, 'numberHere'] },
  { name: 'United Arab Emirates', value: [53.847818, 23.424076, 'numberHere'] },
  { name: 'Afghanistan', value: [67.709953, 33.93911, 'numberHere'] },
  { name: 'Antigua & Barbuda', value: [-61.796428, 17.060816, 'numberHere'] },
  { name: 'Anguilla', value: [-63.068615, 18.220554, 'numberHere'] },
  { name: 'Albania', value: [20.168331, 41.153332, 'numberHere'] },
  { name: 'Armenia', value: [45.038189, 40.069099, 'numberHere'] },
  { name: 'Angola', value: [17.873887, -11.202692, 'numberHere'] },
  { name: 'Antarctica', value: [-0.071389, -75.250973, 'numberHere'] },
  { name: 'Argentina', value: [-63.616672, -38.416097, 'numberHere'] },
  { name: 'American Samoa', value: [-170.132217, -14.270972, 'numberHere'] },
  { name: 'Austria', value: [14.550072, 47.516231, 'numberHere'] },
  { name: 'Australia', value: [133.775136, -25.274398, 'numberHere'] },
  { name: 'Aruba', value: [-69.968338, 12.52111, 'numberHere'] },
  { name: 'Åland Islands', value: [19.9496, 60.1785, 'numberHere'] },
  { name: 'Azerbaijan', value: [47.576927, 40.143105, 'numberHere'] },
  { name: 'Bosnia', value: [17.679076, 43.915886, 'numberHere'] },
  { name: 'Barbados', value: [-59.543198, 13.193887, 'numberHere'] },
  { name: 'Bangladesh', value: [90.356331, 23.684994, 'numberHere'] },
  { name: 'Belgium', value: [4.469936, 50.503887, 'numberHere'] },
  { name: 'Burkina Faso', value: [-1.561593, 12.238333, 'numberHere'] },
  { name: 'Bulgaria', value: [25.48583, 42.733883, 'numberHere'] },
  { name: 'Bahrain', value: [50.637772, 25.930414, 'numberHere'] },
  { name: 'Burundi', value: [29.918886, -3.373056, 'numberHere'] },
  { name: 'Benin', value: [2.315834, 9.30769, 'numberHere'] },
  { name: 'St. Barthélemy', value: [-62.8339, 17.9, 'numberHere'] },
  { name: 'Bermuda', value: [-64.75737, 32.321384, 'numberHere'] },
  { name: 'Brunei', value: [114.727669, 4.535277, 'numberHere'] },
  { name: 'Bolivia', value: [-63.588653, -16.290154, 'numberHere'] },
  { name: 'Caribbean Netherlands', value: [-68.26, 12.18, 'numberHere'] },
  { name: 'Brazil', value: [-51.92528, -14.235004, 'numberHere'] },
  { name: 'Bahamas', value: [-77.39628, 25.03428, 'numberHere'] },
  { name: 'Bhutan', value: [90.433601, 27.514162, 'numberHere'] },
  { name: 'Botswana', value: [24.684866, -22.328474, 'numberHere'] },
  { name: 'Belarus', value: [27.953389, 53.709807, 'numberHere'] },
  { name: 'Belize', value: [-88.49765, 17.189877, 'numberHere'] },
  { name: 'Canada', value: [-106.346771, 56.130366, 'numberHere'] },
  {
    name: 'Cocos (Keeling) Islands',
    value: [96.870956, -12.164165, 'numberHere'],
  },
  { name: 'Congo (DRC)', value: [21.758664, -4.038333, 'numberHere'] },
  {
    name: 'Central African Republic',
    value: [20.939444, 6.611111, 'numberHere'],
  },
  { name: 'Congo (Republic)', value: [15.2832, -0.228, 'numberHere'] },
  { name: 'Switzerland', value: [8.227512, 46.818188, 'numberHere'] },
  { name: 'Ivory Coast', value: [-5.5471, 7.539989, 'numberHere'] },
  { name: 'Chile', value: [-71.542969, -35.675147, 'numberHere'] },
  { name: 'Cameroon', value: [12.354722, 7.369722, 'numberHere'] },
  { name: 'China', value: [104.195397, 35.86166, 'numberHere'] },
  { name: 'Colombia', value: [-74.297333, 4.570868, 'numberHere'] },
  { name: 'Costa Rica', value: [-83.753428, 9.748917, 'numberHere'] },
  { name: 'Cuba', value: [-77.781167, 21.521757, 'numberHere'] },
  { name: 'Cabo Verde', value: [-23.0418, 16.5388, 'numberHere'] },
  { name: 'Curaçao', value: [-68.99, 12.1696, 'numberHere'] },
  { name: 'Christmas Island', value: [105.712, -10.4475, 'numberHere'] },
  { name: 'Cyprus', value: [33.429859, 35.126413, 'numberHere'] },
  { name: 'Czechia', value: [15.472962, 49.817492, 'numberHere'] },
  { name: 'Germany', value: [10.451526, 51.165691, 'numberHere'] },
  { name: 'Djibouti', value: [42.590275, 11.825138, 'numberHere'] },
  { name: 'Denmark', value: [9.501785, 56.26392, 'numberHere'] },
  { name: 'Dominica', value: [-61.370976, 15.414999, 'numberHere'] },
  { name: 'Dominican Republic', value: [-70.162651, 18.735693, 'numberHere'] },
  { name: 'Algeria', value: [1.659626, 28.033886, 'numberHere'] },
  { name: 'Ecuador', value: [-78.183406, -1.831239, 'numberHere'] },
  { name: 'Estonia', value: [25.013607, 58.595272, 'numberHere'] },
  { name: 'Egypt', value: [30.802498, 26.820553, 'numberHere'] },
  { name: 'Western Sahara', value: [-12.885834, 24.215527, 'numberHere'] },
  { name: 'Eritrea', value: [39.782334, 15.179384, 'numberHere'] },
  { name: 'Spain', value: [-3.74922, 40.463667, 'numberHere'] },
  { name: 'Ethiopia', value: [39.782334, 9.145, 'numberHere'] },
  { name: 'Finland', value: [25.748151, 61.92411, 'numberHere'] },
  { name: 'Fiji', value: [178.065032, -17.713371, 'numberHere'] },
  {
    name: 'Falkland Islands (Islas Malvinas)',
    value: [-59.523613, -51.796253, 'numberHere'],
  },
  { name: 'Micronesia', value: [150.550812, 7.425554, 'numberHere'] },
  { name: 'Faroe Islands', value: [-6.911806, 61.892635, 'numberHere'] },
  { name: 'France', value: [2.213749, 46.603354, 'numberHere'] },
  { name: 'Gabon', value: [11.609444, -0.803689, 'numberHere'] },
  { name: 'United Kingdom', value: [-3.435973, 55.378051, 'numberHere'] },
  { name: 'Grenada', value: [-61.604171, 12.262776, 'numberHere'] },
  { name: 'Georgia', value: [-82.900075, 32.165622, 'numberHere'] },
  { name: 'French Guiana', value: [-53.125782, 3.933889, 'numberHere'] },
  { name: 'Guernsey', value: [-2.585278, 49.465691, 'numberHere'] },
  { name: 'Ghana', value: [-1.023194, 7.946527, 'numberHere'] },
  { name: 'Gibraltar', value: [-5.353585, 36.140751, 'numberHere'] },
  { name: 'Greenland', value: [-42.604303, 71.706936, 'numberHere'] },
  { name: 'Gambia', value: [-15.310139, 13.443182, 'numberHere'] },
  { name: 'Guinea', value: [-9.696645, 9.945587, 'numberHere'] },
  { name: 'Guadeloupe', value: [-61.551, 16.265, 'numberHere'] },
  { name: 'Equatorial Guinea', value: [10.267895, 1.650801, 'numberHere'] },
  { name: 'Greece', value: [21.824312, 39.074208, 'numberHere'] },
  {
    name: 'South Georgia & South Sandwich Islands',
    value: [-36.587909, -54.429579, 'numberHere'],
  },
  { name: 'Guatemala', value: [-90.230759, 15.783471, 'numberHere'] },
  { name: 'Guam', value: [144.793731, 13.444304, 'numberHere'] },
  { name: 'Guinea-Bissau', value: [-15.180413, 11.803749, 'numberHere'] },
  { name: 'Guyana', value: [-58.93018, 4.860416, 'numberHere'] },
  { name: 'Hong Kong', value: [114.169361, 22.319303, 'numberHere'] },
  { name: 'Honduras', value: [-86.241905, 15.199999, 'numberHere'] },
  { name: 'Croatia', value: [15.2, 45.1, 'numberHere'] },
  { name: 'Haiti', value: [-72.285215, 18.971187, 'numberHere'] },
  { name: 'Hungary', value: [19.503304, 47.162494, 'numberHere'] },
  { name: 'Indonesia', value: [113.921327, -0.789275, 'numberHere'] },
  { name: 'Ireland', value: [-8.24389, 53.41291, 'numberHere'] },
  { name: 'Israel', value: [34.851612, 31.046051, 'numberHere'] },
  { name: 'Isle of Man', value: [-4.548056, 54.236107, 'numberHere'] },
  { name: 'India', value: [78.96288, 20.593684, 'numberHere'] },
  {
    name: 'British Indian Ocean Territory',
    value: [71.876519, -6.343194, 'numberHere'],
  },
  { name: 'Iraq', value: [43.679291, 33.223191, 'numberHere'] },
  { name: 'Iran', value: [53.688046, 32.427908, 'numberHere'] },
  { name: 'Iceland', value: [-19.020835, 64.963051, 'numberHere'] },
  { name: 'Italy', value: [12.56738, 41.87194, 'numberHere'] },
  { name: 'Jersey', value: [-2.13125, 49.214439, 'numberHere'] },
  { name: 'Jamaica', value: [-77.297508, 18.109581, 'numberHere'] },
  { name: 'Jordan', value: [36.238414, 30.585164, 'numberHere'] },
  { name: 'Japan', value: [138.252924, 36.204824, 'numberHere'] },
  { name: 'Kenya', value: [37.906193, -0.023559, 'numberHere'] },
  { name: 'Kyrgyzstan', value: [74.766098, 41.20438, 'numberHere'] },
  { name: 'Cambodia', value: [104.990963, 12.565679, 'numberHere'] },
  { name: 'Comoros', value: [43.872219, -11.875001, 'numberHere'] },
  { name: 'St. Kitts & Nevis', value: [-62.782998, 17.357822, 'numberHere'] },
  { name: 'North Korea', value: [127.510093, 40.339852, 'numberHere'] },
  { name: 'South Korea', value: [127.766922, 35.907757, 'numberHere'] },
  { name: 'Kuwait', value: [47.481766, 29.31166, 'numberHere'] },
  { name: 'Cayman Islands', value: [-81.2546, 19.3133, 'numberHere'] },
  { name: 'Kazakhstan', value: [66.923684, 48.019573, 'numberHere'] },
  { name: 'Laos', value: [102.495496, 19.85627, 'numberHere'] },
  { name: 'Lebanon', value: [35.862285, 33.854721, 'numberHere'] },
  { name: 'St. Lucia', value: [-60.978893, 13.909444, 'numberHere'] },
  { name: 'Liechtenstein', value: [9.555373, 47.166, 'numberHere'] },
  { name: 'Lithuania', value: [23.881275, 55.169438, 'numberHere'] },
  { name: 'Luxembourg', value: [6.129583, 49.815273, 'numberHere'] },
  { name: 'Latvia', value: [24.603189, 56.879635, 'numberHere'] },
  { name: 'Libya', value: [17.228331, 26.3351, 'numberHere'] },
  { name: 'Morocco', value: [-7.09262, 31.791702, 'numberHere'] },
  { name: 'Monaco', value: [7.412841, 43.750298, 'numberHere'] },
  { name: 'Moldova', value: [28.369885, 47.411631, 'numberHere'] },
  { name: 'Montenegro', value: [19.37439, 42.708678, 'numberHere'] },
  { name: 'St. Martin', value: [-63.0501, 18.0708, 'numberHere'] },
  { name: 'Madagascar', value: [46.869107, -18.766947, 'numberHere'] },
  { name: 'Marshall Islands', value: [171.184478, 7.131474, 'numberHere'] },
  { name: 'North Macedonia', value: [21.745275, 41.608635, 'numberHere'] },
  { name: 'Mali', value: [-3.996166, 17.570692, 'numberHere'] },
  { name: 'Myanmar', value: [95.956223, 21.913965, 'numberHere'] },
  { name: 'Mongolia', value: [103.846656, 46.862496, 'numberHere'] },
  { name: 'Macao', value: [113.543873, 22.198745, 'numberHere'] },
  {
    name: 'Northern Mariana Islands',
    value: [145.6739, 15.0979, 'numberHere'],
  },
  { name: 'Martinique', value: [-61.0242, 14.6415, 'numberHere'] },
  { name: 'Mauritania', value: [-10.940835, 21.00789, 'numberHere'] },
  { name: 'Montserrat', value: [-62.1874, 16.7425, 'numberHere'] },
  { name: 'Malta', value: [14.375416, 35.937496, 'numberHere'] },
  { name: 'Mauritius', value: [57.552152, -20.348404, 'numberHere'] },
  { name: 'Maldives', value: [73.22068, 3.202778, 'numberHere'] },
  { name: 'Malawi', value: [34.301525, -13.254308, 'numberHere'] },
  { name: 'Mexico', value: [-102.552784, 23.634501, 'numberHere'] },
  { name: 'Malaysia', value: [101.975766, 4.210484, 'numberHere'] },
  { name: 'Mozambique', value: [35.529562, -18.665695, 'numberHere'] },
  { name: 'Namibia', value: [18.49041, -22.95764, 'numberHere'] },
  { name: 'New Caledonia', value: [165.618042, -20.904305, 'numberHere'] },
  { name: 'Niger', value: [8.081666, 17.607789, 'numberHere'] },
  { name: 'Norfolk Island', value: [167.9547, -29.0408, 'numberHere'] },
  { name: 'Nigeria', value: [8.675277, 9.081999, 'numberHere'] },
  { name: 'Nicaragua', value: [-85.207229, 12.865416, 'numberHere'] },
  { name: 'Netherlands', value: [5.291266, 52.132633, 'numberHere'] },
  { name: 'Norway', value: [8.468946, 60.472024, 'numberHere'] },
  { name: 'Nepal', value: [84.124008, 28.394857, 'numberHere'] },
  { name: 'Nauru', value: [166.931503, -0.522778, 'numberHere'] },
  {
    name: 'Aotearoa New Zealand',
    value: [174.885971, -40.900557, 'numberHere'],
  },
  { name: 'Oman', value: [55.923255, 21.512583, 'numberHere'] },
  { name: 'Panama', value: [-80.782127, 8.537981, 'numberHere'] },
  { name: 'Peru', value: [-75.015152, -9.189967, 'numberHere'] },
  { name: 'Papua New Guinea', value: [143.95555, -6.314993, 'numberHere'] },
  { name: 'Philippines', value: [121.774017, 12.879721, 'numberHere'] },
  { name: 'Pakistan', value: [69.345116, 30.375321, 'numberHere'] },
  { name: 'Poland', value: [19.145136, 51.919438, 'numberHere'] },
  { name: 'St. Pierre & Miquelon', value: [-56.2711, 46.8852, 'numberHere'] },
  { name: 'Puerto Rico', value: [-66.590149, 18.220833, 'numberHere'] },
  { name: 'Palestine', value: [35.2332, 31.9522, 'numberHere'] },
  { name: 'Portugal', value: [-8.224454, 39.399872, 'numberHere'] },
  { name: 'Palau', value: [134.58252, 7.51498, 'numberHere'] },
  { name: 'Paraguay', value: [-58.443832, -23.442503, 'numberHere'] },
  { name: 'Qatar', value: [51.183884, 25.354826, 'numberHere'] },
  { name: 'Réunion', value: [55.5364, -21.1151, 'numberHere'] },
  { name: 'Romania', value: [24.96676, 45.943161, 'numberHere'] },
  { name: 'Serbia', value: [21.005859, 44.016521, 'numberHere'] },
  { name: 'Russia', value: [105.318756, 61.52401, 'numberHere'] },
  { name: 'Rwanda', value: [29.873888, -1.940278, 'numberHere'] },
  { name: 'Saudi Arabia', value: [45.079162, 23.885942, 'numberHere'] },
  { name: 'Solomon Islands', value: [160.156194, -9.64571, 'numberHere'] },
  { name: 'Seychelles', value: [55.491977, -4.679574, 'numberHere'] },
  { name: 'Sudan', value: [30.217636, 12.862807, 'numberHere'] },
  { name: 'Sweden', value: [18.643501, 60.128161, 'numberHere'] },
  { name: 'Singapore', value: [103.819836, 1.352083, 'numberHere'] },
  { name: 'St. Helena', value: [-5.7089, -15.965, 'numberHere'] },
  { name: 'Slovenia', value: [14.995463, 46.151241, 'numberHere'] },
  { name: 'Svalbard & Jan Mayen', value: [23.6703, 77.5536, 'numberHere'] },
  { name: 'Slovakia', value: [19.699024, 48.669026, 'numberHere'] },
  { name: 'Sierra Leone', value: [-11.779889, 8.460555, 'numberHere'] },
  { name: 'San Marino', value: [12.457777, 43.933333, 'numberHere'] },
  { name: 'Senegal', value: [-14.452362, 14.497401, 'numberHere'] },
  { name: 'Somalia', value: [46.199616, 5.152149, 'numberHere'] },
  { name: 'Suriname', value: [-56.027783, 3.919305, 'numberHere'] },
  { name: 'South Sudan', value: [31.307, 7.309, 'numberHere'] },
  { name: 'São Tomé & Príncipe', value: [6.613081, 0.18636, 'numberHere'] },
  { name: 'El Salvador', value: [-88.89653, 13.794185, 'numberHere'] },
  { name: 'Sint Maarten', value: [-63.0501, 18.0708, 'numberHere'] },
  { name: 'Syria', value: [38.996815, 34.802075, 'numberHere'] },
  { name: 'Swaziland', value: [31.4659, -26.5225, 'numberHere'] },
  { name: 'Turks & Caicos Islands', value: [-71.7979, 21.694, 'numberHere'] },
  { name: 'Chad', value: [18.732207, 15.454166, 'numberHere'] },
  {
    name: 'French Southern Territories',
    value: [69.348557, -49.280366, 'numberHere'],
  },
  { name: 'Togo', value: [0.824782, 8.619543, 'numberHere'] },
  { name: 'Thailand', value: [100.992541, 15.870032, 'numberHere'] },
  { name: 'Tajikistan', value: [71.276093, 38.861034, 'numberHere'] },
  { name: 'East Timor', value: [125.727539, -8.874217, 'numberHere'] },
  { name: 'Turkmenistan', value: [59.556278, 38.969719, 'numberHere'] },
  { name: 'Tunisia', value: [9.537499, 33.886917, 'numberHere'] },
  { name: 'Türkiye', value: [35.243322, 38.963745, 'numberHere'] },
  { name: 'Trinidad & Tobago', value: [-61.222503, 10.691803, 'numberHere'] },
  { name: 'Tuvalu', value: [179.194, -7.1095, 'numberHere'] },
  { name: 'Taiwan', value: [120.960515, 23.69781, 'numberHere'] },
  { name: 'Tanzania', value: [34.888822, -6.369028, 'numberHere'] },
  { name: 'Ukraine', value: [31.16558, 48.379433, 'numberHere'] },
  { name: 'Uganda', value: [32.290275, 1.373333, 'numberHere'] },
  { name: 'U.S. Outlying Islands', value: [-139.4, 24.3, 'numberHere'] },
  {
    name: 'United States of America',
    value: [-95.712891, 37.09024, 'numberHere'],
  },
  { name: 'Uruguay', value: [-55.765835, -32.522779, 'numberHere'] },
  { name: 'Uzbekistan', value: [64.585262, 41.377491, 'numberHere'] },
  { name: 'Vatican City', value: [12.4534, 41.9029, 'numberHere'] },
  {
    name: 'St. Vincent & Grenadines',
    value: [-61.287228, 12.984305, 'numberHere'],
  },
  { name: 'Venezuela', value: [-66.58973, 6.42375, 'numberHere'] },
  {
    name: 'British Virgin Islands',
    value: [-64.639968, 18.420695, 'numberHere'],
  },
  { name: 'U.S. Virgin Islands', value: [-64.896335, 18.335765, 'numberHere'] },
  { name: 'Vietnam', value: [108.277199, 14.058324, 'numberHere'] },
  { name: 'Vanuatu', value: [166.959158, -15.376706, 'numberHere'] },
  { name: 'Kosovo', value: [20.902977, 42.602636, 'numberHere'] },
  { name: 'Yemen', value: [48.516388, 15.552727, 'numberHere'] },
  { name: 'Mayotte', value: [45.166244, -12.8275, 'numberHere'] },
  { name: 'South Africa', value: [22.937506, -30.559482, 'numberHere'] },
  { name: 'Zambia', value: [27.849332, -13.133897, 'numberHere'] },
  { name: 'Zimbabwe', value: [29.154857, -19.015438, 'numberHere'] },
]

interface I_WorldMap {
  clAnalyticsData: I_AnalyticsData
}

const WorldMap = ({ clAnalyticsData }: I_WorldMap) => {
  const data = useGetAnalyticsCountryPathTotal(clAnalyticsData)
  console.log('data', data)
  const [option, setOption] = useState({})
  const deviceSize = useDeviceSize()

  useEffect(() => {
    // Fetch world map JSON
    fetch('/maps/world.json')
      .then((res) => res.json())
      .then((worldJson) => {
        registerMap('world', worldJson) // Register map

        setOption({
          tooltip: {
            trigger: 'item',
            borderColor: '#5470C6',
            formatter: (params: {
              name: string
              value?: number | [number, number, number]
              seriesName: string
            }) =>
              `${params.name}: ${
                Array.isArray(params.value) ? params.value[2] : 'No data'
              }`,
          },
          geo: {
            map: 'world',
            roam: false, // Enable zoom and pan

            zoom: 1.2, // Adjust zoom level to fit screen
            layoutSize: '100%',

            label: {
              show: false,
            },

            itemStyle: {
              areaColor: '#E2F2FA',
              borderColor: '#DAEBFA',
            },
            emphasis: {
              label: { show: false },
              itemStyle: {
                areaColor: '#A5D8FF',
              },
            },
          },
          series: [
            {
              name: 'Effect Points',
              type: 'effectScatter',
              coordinateSystem: 'geo',
              data: [
                { name: 'Andorra', value: [1.601554, 42.546245, 10] },
                {
                  name: 'United Arab Emirates',
                  value: [53.847818, 23.424076, 10],
                },
                {
                  name: 'Afghanistan',
                  value: [67.709953, 33.93911, 10],
                },
                {
                  name: 'Antigua & Barbuda',
                  value: [-61.796428, 17.060816, 10],
                },
                {
                  name: 'Anguilla',
                  value: [-63.068615, 18.220554, 10],
                },
                {
                  name: 'Albania',
                  value: [20.168331, 41.153332, 10],
                },
              ],
              itemStyle: {
                color: '#63B6AC',
              },
            },
          ],
        })
      })
  }, [])

  return (
    <ReactECharts
      option={option}
      style={{
        height: `${deviceSize === 'sm' ? '170px' : '370px'}`,
        width: '100%',
      }}
    />
  )
}

export default WorldMap
