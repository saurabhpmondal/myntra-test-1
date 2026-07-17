/**
 * =====================================================
 * Project Phoenix
 * Product : Myntra Analytics
 * Module  : Ads Service
 * Version : V1.2
 * =====================================================
 */

import { DataStore } from "../dataService.js";

import { FilterState } from "../filterService.js";

import { getPeriodKey } from "../periodService.js";

import { getPreviousPeriod } from "../comparisonService.js";

import { consolidateAds } from "./adsConsolidator.js";

import { buildAdsKpis } from "./adsKpi.js";

import { buildAdsChart } from "./adsChart.js";

import {

    getDailyAdsColumns,

    getCampaignAdsColumns,

    getAdgroupAdsColumns

} from "./adsColumns.js";

export function generateAdsReport(){

    const ads = getFilteredAds();

    const consolidated = consolidateAds(ads);

    const previousPeriod = getPreviousPeriod(FilterState.period);
    let previousDailyRows = null;
    let compareLabel = "Previous Period";

    if (previousPeriod) {
        const prevAds = getFilteredAds(previousPeriod);
        const prevConsolidated = consolidateAds(prevAds);
        previousDailyRows = prevConsolidated.daily;

        const year = Math.floor(previousPeriod / 100);
        const month = previousPeriod % 100;
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
        compareLabel = `${months[month - 1] || ""} ${year}`;
    }

    return{

        kpis:

            buildAdsKpis(

                consolidated.daily,

                previousDailyRows,

                compareLabel

            ),

        chart:

            buildAdsChart(

                consolidated.daily

            ),

        reports:{

            daily:{

                title:"Daily Ads Spend",

                columns:

                    getDailyAdsColumns(),

                rows:

                    consolidated.daily

            },

            campaign:{

                title:"Campaign Report",

                columns:

                    getCampaignAdsColumns(),

                rows:

                    consolidated.campaign

            },

            adgroup:{

                title:"Ad Group Report",

                columns:

                    getAdgroupAdsColumns(),

                rows:

                    consolidated.adgroup

            }

        }

    };

}

function getFilteredAds(targetPeriod = undefined){

    const period = targetPeriod !== undefined ? targetPeriod : FilterState.period;

    const ads = DataStore.ads || [];

    if(!period){

        return ads;

    }

    return ads.filter(row=>{

        return(

            getPeriodKey(

                row.month,

                row.year

            )

            ===

            period

        );

    });

}