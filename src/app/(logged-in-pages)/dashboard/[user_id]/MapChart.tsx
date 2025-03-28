'use client'
import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import useDeviceSize from '@/app/hooks/useDeviceSize'
import { registerMap } from 'echarts/core'
import {
  GeoPoint,
  // mapAnalyticsToGeoPoints,
} from '@/app/utilities/analytics/mapAnalyticsToGeoPoints'
// import { I_Analytics_Data } from '@/app/hooks/this-website-only/getAnalyticsCountryPathTotal'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const effectScatterData = [
  {
    name: 'Andorra',
    value: [1.601554, 42.546245, 'views', 'hugs', 'messages'],
  },
  {
    name: 'United Arab Emirates',
    value: [53.847818, 23.424076, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Afghanistan',
    value: [67.709953, 33.93911, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Antigua & Barbuda',
    value: [-61.796428, 17.060816, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Anguilla',
    value: [-63.068615, 18.220554, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Albania',
    value: [20.168331, 41.153332, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Armenia',
    value: [45.038189, 40.069099, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Angola',
    value: [17.873887, -11.202692, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Antarctica',
    value: [-0.071389, -75.250973, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Argentina',
    value: [-63.616672, -38.416097, 'views', 'hugs', 'messages'],
  },
  {
    name: 'American Samoa',
    value: [-170.132217, -14.270972, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Austria',
    value: [14.550072, 47.516231, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Australia',
    value: [133.775136, -25.274398, 'views', 'hugs', 'messages'],
  },
  { name: 'Aruba', value: [-69.968338, 12.52111, 'views', 'hugs', 'messages'] },
  {
    name: 'Åland Islands',
    value: [19.9496, 60.1785, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Azerbaijan',
    value: [47.576927, 40.143105, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bosnia',
    value: [17.679076, 43.915886, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Barbados',
    value: [-59.543198, 13.193887, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bangladesh',
    value: [90.356331, 23.684994, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Belgium',
    value: [4.469936, 50.503887, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Burkina Faso',
    value: [-1.561593, 12.238333, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bulgaria',
    value: [25.48583, 42.733883, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bahrain',
    value: [50.637772, 25.930414, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Burundi',
    value: [29.918886, -3.373056, 'views', 'hugs', 'messages'],
  },
  { name: 'Benin', value: [2.315834, 9.30769, 'views', 'hugs', 'messages'] },
  {
    name: 'St. Barthélemy',
    value: [-62.8339, 17.9, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bermuda',
    value: [-64.75737, 32.321384, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Brunei',
    value: [114.727669, 4.535277, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bolivia',
    value: [-63.588653, -16.290154, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Caribbean Netherlands',
    value: [-68.26, 12.18, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Brazil',
    value: [-51.92528, -14.235004, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bahamas',
    value: [-77.39628, 25.03428, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Bhutan',
    value: [90.433601, 27.514162, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Botswana',
    value: [24.684866, -22.328474, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Belarus',
    value: [27.953389, 53.709807, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Belize',
    value: [-88.49765, 17.189877, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Canada',
    value: [-106.346771, 56.130366, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Cocos (Keeling) Islands',
    value: [96.870956, -12.164165, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Congo (DRC)',
    value: [21.758664, -4.038333, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Central African Republic',
    value: [20.939444, 6.611111, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Congo (Republic)',
    value: [15.2832, -0.228, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Switzerland',
    value: [8.227512, 46.818188, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Ivory Coast',
    value: [-5.5471, 7.539989, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Chile',
    value: [-71.542969, -35.675147, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Cameroon',
    value: [12.354722, 7.369722, 'views', 'hugs', 'messages'],
  },
  { name: 'China', value: [104.195397, 35.86166, 'views', 'hugs', 'messages'] },
  {
    name: 'Colombia',
    value: [-74.297333, 4.570868, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Costa Rica',
    value: [-83.753428, 9.748917, 'views', 'hugs', 'messages'],
  },
  { name: 'Cuba', value: [-77.781167, 21.521757, 'views', 'hugs', 'messages'] },
  {
    name: 'Cabo Verde',
    value: [-23.0418, 16.5388, 'views', 'hugs', 'messages'],
  },
  { name: 'Curaçao', value: [-68.99, 12.1696, 'views', 'hugs', 'messages'] },
  {
    name: 'Christmas Island',
    value: [105.712, -10.4475, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Cyprus',
    value: [33.429859, 35.126413, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Czechia',
    value: [15.472962, 49.817492, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Germany',
    value: [10.451526, 51.165691, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Djibouti',
    value: [42.590275, 11.825138, 'views', 'hugs', 'messages'],
  },
  { name: 'Denmark', value: [9.501785, 56.26392, 'views', 'hugs', 'messages'] },
  {
    name: 'Dominica',
    value: [-61.370976, 15.414999, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Dominican Republic',
    value: [-70.162651, 18.735693, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Algeria',
    value: [1.659626, 28.033886, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Ecuador',
    value: [-78.183406, -1.831239, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Estonia',
    value: [25.013607, 58.595272, 'views', 'hugs', 'messages'],
  },
  { name: 'Egypt', value: [30.802498, 26.820553, 'views', 'hugs', 'messages'] },
  {
    name: 'Western Sahara',
    value: [-12.885834, 24.215527, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Eritrea',
    value: [39.782334, 15.179384, 'views', 'hugs', 'messages'],
  },
  { name: 'Spain', value: [-3.74922, 40.463667, 'views', 'hugs', 'messages'] },
  { name: 'Ethiopia', value: [39.782334, 9.145, 'views', 'hugs', 'messages'] },
  {
    name: 'Finland',
    value: [25.748151, 61.92411, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Fiji',
    value: [178.065032, -17.713371, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Falkland Islands (Islas Malvinas)',
    value: [-59.523613, -51.796253, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Micronesia',
    value: [150.550812, 7.425554, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Faroe Islands',
    value: [-6.911806, 61.892635, 'views', 'hugs', 'messages'],
  },
  { name: 'France', value: [2.213749, 46.603354, 'views', 'hugs', 'messages'] },
  { name: 'Gabon', value: [11.609444, -0.803689, 'views', 'hugs', 'messages'] },
  {
    name: 'United Kingdom',
    value: [-3.435973, 55.378051, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Grenada',
    value: [-61.604171, 12.262776, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Georgia',
    value: [-82.900075, 32.165622, 'views', 'hugs', 'messages'],
  },
  {
    name: 'French Guiana',
    value: [-53.125782, 3.933889, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Guernsey',
    value: [-2.585278, 49.465691, 'views', 'hugs', 'messages'],
  },
  { name: 'Ghana', value: [-1.023194, 7.946527, 'views', 'hugs', 'messages'] },
  {
    name: 'Gibraltar',
    value: [-5.353585, 36.140751, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Greenland',
    value: [-42.604303, 71.706936, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Gambia',
    value: [-15.310139, 13.443182, 'views', 'hugs', 'messages'],
  },
  { name: 'Guinea', value: [-9.696645, 9.945587, 'views', 'hugs', 'messages'] },
  { name: 'Guadeloupe', value: [-61.551, 16.265, 'views', 'hugs', 'messages'] },
  {
    name: 'Equatorial Guinea',
    value: [10.267895, 1.650801, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Greece',
    value: [21.824312, 39.074208, 'views', 'hugs', 'messages'],
  },
  {
    name: 'South Georgia & South Sandwich Islands',
    value: [-36.587909, -54.429579, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Guatemala',
    value: [-90.230759, 15.783471, 'views', 'hugs', 'messages'],
  },
  { name: 'Guam', value: [144.793731, 13.444304, 'views', 'hugs', 'messages'] },
  {
    name: 'Guinea-Bissau',
    value: [-15.180413, 11.803749, 'views', 'hugs', 'messages'],
  },
  { name: 'Guyana', value: [-58.93018, 4.860416, 'views', 'hugs', 'messages'] },
  {
    name: 'Hong Kong',
    value: [114.169361, 22.319303, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Honduras',
    value: [-86.241905, 15.199999, 'views', 'hugs', 'messages'],
  },
  { name: 'Croatia', value: [15.2, 45.1, 'views', 'hugs', 'messages'] },
  {
    name: 'Haiti',
    value: [-72.285215, 18.971187, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Hungary',
    value: [19.503304, 47.162494, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Indonesia',
    value: [113.921327, -0.789275, 'views', 'hugs', 'messages'],
  },
  { name: 'Ireland', value: [-8.24389, 53.41291, 'views', 'hugs', 'messages'] },
  {
    name: 'Israel',
    value: [34.851612, 31.046051, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Isle of Man',
    value: [-4.548056, 54.236107, 'views', 'hugs', 'messages'],
  },
  { name: 'India', value: [78.96288, 20.593684, 'views', 'hugs', 'messages'] },
  {
    name: 'British Indian Ocean Territory',
    value: [71.876519, -6.343194, 'views', 'hugs', 'messages'],
  },
  { name: 'Iraq', value: [43.679291, 33.223191, 'views', 'hugs', 'messages'] },
  { name: 'Iran', value: [53.688046, 32.427908, 'views', 'hugs', 'messages'] },
  {
    name: 'Iceland',
    value: [-19.020835, 64.963051, 'views', 'hugs', 'messages'],
  },
  { name: 'Italy', value: [12.56738, 41.87194, 'views', 'hugs', 'messages'] },
  { name: 'Jersey', value: [-2.13125, 49.214439, 'views', 'hugs', 'messages'] },
  {
    name: 'Jamaica',
    value: [-77.297508, 18.109581, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Jordan',
    value: [36.238414, 30.585164, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Japan',
    value: [138.252924, 36.204824, 'views', 'hugs', 'messages'],
  },
  { name: 'Kenya', value: [37.906193, -0.023559, 'views', 'hugs', 'messages'] },
  {
    name: 'Kyrgyzstan',
    value: [74.766098, 41.20438, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Cambodia',
    value: [104.990963, 12.565679, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Comoros',
    value: [43.872219, -11.875001, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Kitts & Nevis',
    value: [-62.782998, 17.357822, 'views', 'hugs', 'messages'],
  },
  {
    name: 'North Korea',
    value: [127.510093, 40.339852, 'views', 'hugs', 'messages'],
  },
  {
    name: 'South Korea',
    value: [127.766922, 35.907757, 'views', 'hugs', 'messages'],
  },
  { name: 'Kuwait', value: [47.481766, 29.31166, 'views', 'hugs', 'messages'] },
  {
    name: 'Cayman Islands',
    value: [-81.2546, 19.3133, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Kazakhstan',
    value: [66.923684, 48.019573, 'views', 'hugs', 'messages'],
  },
  { name: 'Laos', value: [102.495496, 19.85627, 'views', 'hugs', 'messages'] },
  {
    name: 'Lebanon',
    value: [35.862285, 33.854721, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Lucia',
    value: [-60.978893, 13.909444, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Liechtenstein',
    value: [9.555373, 47.166, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Lithuania',
    value: [23.881275, 55.169438, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Luxembourg',
    value: [6.129583, 49.815273, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Latvia',
    value: [24.603189, 56.879635, 'views', 'hugs', 'messages'],
  },
  { name: 'Libya', value: [17.228331, 26.3351, 'views', 'hugs', 'messages'] },
  {
    name: 'Morocco',
    value: [-7.09262, 31.791702, 'views', 'hugs', 'messages'],
  },
  { name: 'Monaco', value: [7.412841, 43.750298, 'views', 'hugs', 'messages'] },
  {
    name: 'Moldova',
    value: [28.369885, 47.411631, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Montenegro',
    value: [19.37439, 42.708678, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Martin',
    value: [-63.0501, 18.0708, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Madagascar',
    value: [46.869107, -18.766947, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Marshall Islands',
    value: [171.184478, 7.131474, 'views', 'hugs', 'messages'],
  },
  {
    name: 'North Macedonia',
    value: [21.745275, 41.608635, 'views', 'hugs', 'messages'],
  },
  { name: 'Mali', value: [-3.996166, 17.570692, 'views', 'hugs', 'messages'] },
  {
    name: 'Myanmar',
    value: [95.956223, 21.913965, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Mongolia',
    value: [103.846656, 46.862496, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Macao',
    value: [113.543873, 22.198745, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Northern Mariana Islands',
    value: [145.6739, 15.0979, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Martinique',
    value: [-61.0242, 14.6415, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Mauritania',
    value: [-10.940835, 21.00789, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Montserrat',
    value: [-62.1874, 16.7425, 'views', 'hugs', 'messages'],
  },
  { name: 'Malta', value: [14.375416, 35.937496, 'views', 'hugs', 'messages'] },
  {
    name: 'Mauritius',
    value: [57.552152, -20.348404, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Maldives',
    value: [73.22068, 3.202778, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Malawi',
    value: [34.301525, -13.254308, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Mexico',
    value: [-102.552784, 23.634501, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Malaysia',
    value: [101.975766, 4.210484, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Mozambique',
    value: [35.529562, -18.665695, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Namibia',
    value: [18.49041, -22.95764, 'views', 'hugs', 'messages'],
  },
  {
    name: 'New Caledonia',
    value: [165.618042, -20.904305, 'views', 'hugs', 'messages'],
  },
  { name: 'Niger', value: [8.081666, 17.607789, 'views', 'hugs', 'messages'] },
  {
    name: 'Norfolk Island',
    value: [167.9547, -29.0408, 'views', 'hugs', 'messages'],
  },
  { name: 'Nigeria', value: [8.675277, 9.081999, 'views', 'hugs', 'messages'] },
  {
    name: 'Nicaragua',
    value: [-85.207229, 12.865416, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Netherlands',
    value: [5.291266, 52.132633, 'views', 'hugs', 'messages'],
  },
  { name: 'Norway', value: [8.468946, 60.472024, 'views', 'hugs', 'messages'] },
  { name: 'Nepal', value: [84.124008, 28.394857, 'views', 'hugs', 'messages'] },
  {
    name: 'Nauru',
    value: [166.931503, -0.522778, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Aotearoa New Zealand',
    value: [174.885971, -40.900557, 'views', 'hugs', 'messages'],
  },
  { name: 'Oman', value: [55.923255, 21.512583, 'views', 'hugs', 'messages'] },
  {
    name: 'Panama',
    value: [-80.782127, 8.537981, 'views', 'hugs', 'messages'],
  },
  { name: 'Peru', value: [-75.015152, -9.189967, 'views', 'hugs', 'messages'] },
  {
    name: 'Papua New Guinea',
    value: [143.95555, -6.314993, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Philippines',
    value: [121.774017, 12.879721, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Pakistan',
    value: [69.345116, 30.375321, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Poland',
    value: [19.145136, 51.919438, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Pierre & Miquelon',
    value: [-56.2711, 46.8852, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Puerto Rico',
    value: [-66.590149, 18.220833, 'views', 'hugs', 'messages'],
  },
  { name: 'Palestine', value: [35.2332, 31.9522, 'views', 'hugs', 'messages'] },
  {
    name: 'Portugal',
    value: [-8.224454, 39.399872, 'views', 'hugs', 'messages'],
  },
  { name: 'Palau', value: [134.58252, 7.51498, 'views', 'hugs', 'messages'] },
  {
    name: 'Paraguay',
    value: [-58.443832, -23.442503, 'views', 'hugs', 'messages'],
  },
  { name: 'Qatar', value: [51.183884, 25.354826, 'views', 'hugs', 'messages'] },
  { name: 'Réunion', value: [55.5364, -21.1151, 'views', 'hugs', 'messages'] },
  {
    name: 'Romania',
    value: [24.96676, 45.943161, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Serbia',
    value: [21.005859, 44.016521, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Russia',
    value: [105.318756, 61.52401, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Rwanda',
    value: [29.873888, -1.940278, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Saudi Arabia',
    value: [45.079162, 23.885942, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Solomon Islands',
    value: [160.156194, -9.64571, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Seychelles',
    value: [55.491977, -4.679574, 'views', 'hugs', 'messages'],
  },
  { name: 'Sudan', value: [30.217636, 12.862807, 'views', 'hugs', 'messages'] },
  {
    name: 'Sweden',
    value: [18.643501, 60.128161, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Singapore',
    value: [103.819836, 1.352083, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Helena',
    value: [-5.7089, -15.965, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Slovenia',
    value: [14.995463, 46.151241, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Svalbard & Jan Mayen',
    value: [23.6703, 77.5536, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Slovakia',
    value: [19.699024, 48.669026, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Sierra Leone',
    value: [-11.779889, 8.460555, 'views', 'hugs', 'messages'],
  },
  {
    name: 'San Marino',
    value: [12.457777, 43.933333, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Senegal',
    value: [-14.452362, 14.497401, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Somalia',
    value: [46.199616, 5.152149, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Suriname',
    value: [-56.027783, 3.919305, 'views', 'hugs', 'messages'],
  },
  { name: 'South Sudan', value: [31.307, 7.309, 'views', 'hugs', 'messages'] },
  {
    name: 'São Tomé & Príncipe',
    value: [6.613081, 0.18636, 'views', 'hugs', 'messages'],
  },
  {
    name: 'El Salvador',
    value: [-88.89653, 13.794185, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Sint Maarten',
    value: [-63.0501, 18.0708, 'views', 'hugs', 'messages'],
  },
  { name: 'Syria', value: [38.996815, 34.802075, 'views', 'hugs', 'messages'] },
  {
    name: 'Swaziland',
    value: [31.4659, -26.5225, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Turks & Caicos Islands',
    value: [-71.7979, 21.694, 'views', 'hugs', 'messages'],
  },
  { name: 'Chad', value: [18.732207, 15.454166, 'views', 'hugs', 'messages'] },
  {
    name: 'French Southern Territories',
    value: [69.348557, -49.280366, 'views', 'hugs', 'messages'],
  },
  { name: 'Togo', value: [0.824782, 8.619543, 'views', 'hugs', 'messages'] },
  {
    name: 'Thailand',
    value: [100.992541, 15.870032, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Tajikistan',
    value: [71.276093, 38.861034, 'views', 'hugs', 'messages'],
  },
  {
    name: 'East Timor',
    value: [125.727539, -8.874217, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Turkmenistan',
    value: [59.556278, 38.969719, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Tunisia',
    value: [9.537499, 33.886917, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Türkiye',
    value: [35.243322, 38.963745, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Trinidad & Tobago',
    value: [-61.222503, 10.691803, 'views', 'hugs', 'messages'],
  },
  { name: 'Tuvalu', value: [179.194, -7.1095, 'views', 'hugs', 'messages'] },
  {
    name: 'Taiwan',
    value: [120.960515, 23.69781, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Tanzania',
    value: [34.888822, -6.369028, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Ukraine',
    value: [31.16558, 48.379433, 'views', 'hugs', 'messages'],
  },
  { name: 'Uganda', value: [32.290275, 1.373333, 'views', 'hugs', 'messages'] },
  {
    name: 'U.S. Outlying Islands',
    value: [-139.4, 24.3, 'views', 'hugs', 'messages'],
  },
  {
    name: 'United States of America',
    value: [-95.712891, 37.09024, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Uruguay',
    value: [-55.765835, -32.522779, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Uzbekistan',
    value: [64.585262, 41.377491, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Vatican City',
    value: [12.4534, 41.9029, 'views', 'hugs', 'messages'],
  },
  {
    name: 'St. Vincent & Grenadines',
    value: [-61.287228, 12.984305, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Venezuela',
    value: [-66.58973, 6.42375, 'views', 'hugs', 'messages'],
  },
  {
    name: 'British Virgin Islands',
    value: [-64.639968, 18.420695, 'views', 'hugs', 'messages'],
  },
  {
    name: 'U.S. Virgin Islands',
    value: [-64.896335, 18.335765, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Vietnam',
    value: [108.277199, 14.058324, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Vanuatu',
    value: [166.959158, -15.376706, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Kosovo',
    value: [20.902977, 42.602636, 'views', 'hugs', 'messages'],
  },
  { name: 'Yemen', value: [48.516388, 15.552727, 'views', 'hugs', 'messages'] },
  {
    name: 'Mayotte',
    value: [45.166244, -12.8275, 'views', 'hugs', 'messages'],
  },
  {
    name: 'South Africa',
    value: [22.937506, -30.559482, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Zambia',
    value: [27.849332, -13.133897, 'views', 'hugs', 'messages'],
  },
  {
    name: 'Zimbabwe',
    value: [29.154857, -19.015438, 'views', 'hugs', 'messages'],
  },
]

interface I_WorldMap {
  mappedData: GeoPoint[] | undefined
}
type I_Parameters = [number, number, number, number, number] // [lon, lat, views, hugs, messages]

const WorldMap = ({ mappedData }: I_WorldMap) => {
  const [option, setOption] = useState({})
  // const [mappedData, setmappedData] = useState<GeoPoint[] | null>(null)
  const deviceSize = useDeviceSize()

  // const mapData = async () => {
  //   if (!analyticsWithCountryPathTotal) return
  //   const result = await mapAnalyticsToGeoPoints(analyticsWithCountryPathTotal)
  //   setmappedData(result)
  // }

  useEffect(() => {
    // Fetch world map JSON
    // mapData()
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
              value?: I_Parameters
              seriesName: string
            }) => {
              if (Array.isArray(params.value)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [lon, lat, views, hugs, messages] = params.value
                return `
                  <strong>${params.name}</strong><br/>
                  views: ${views}<br/>
                  hugs: ${hugs}<br/>
                  messages: ${messages}
                `
              } else {
                return `<strong>${params.name}</strong><br/>No data`
              }
            },
          },
          geo: {
            map: 'world',
            roam: true, // Enable zoom and pan

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
              data: mappedData,
              itemStyle: {
                color: '#63B6AC',
              },
            },
          ],
        })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
