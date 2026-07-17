/**
 * =====================================================
 * Project Phoenix
 * Product : Myntra Analytics
 * Module  : Ads KPI Engine
 * Version : V1.2
 * =====================================================
 */

import {

    createEmptyAdsMetrics,

    mergeAdsMetrics,

    finalizeAdsMetrics

} from "./adsCalculation.js";

function growth(current, previous) {

    current = Number(current) || 0;

    previous = Number(previous) || 0;

    if (current === 0 && previous === 0) return 0;

    if (previous === 0) return 100;

    if (current === 0) return -100;

    return Number(

        (((current - previous) / previous) * 100).toFixed(2)

    );

}

export function buildAdsKpis(dailyRows, previousDailyRows = null, compareLabel = "Previous Period"){

    const total = createEmptyAdsMetrics();

    dailyRows.forEach(row=>{

        mergeAdsMetrics(

            total,

            row

        );

    });

    finalizeAdsMetrics(total);

    let previousTotal = null;

    if (previousDailyRows) {

        previousTotal = createEmptyAdsMetrics();

        previousDailyRows.forEach(row=>{

            mergeAdsMetrics(

                previousTotal,

                row

            );

        });

        finalizeAdsMetrics(previousTotal);

    }

    const getGrowthValue = (curr, prevKey) => {

        if (!previousTotal) return 0;

        return growth(curr, previousTotal[prevKey]);

    };

    return [

        {

            title:"Impressions",

            value:Number(total.impressions)

                .toLocaleString("en-IN"),

            icon:"eye",

            className:"primary",

            growth: previousTotal ? getGrowthValue(total.impressions, "impressions") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        },

        {

            title:"Clicks",

            value:Number(total.clicks)

                .toLocaleString("en-IN"),

            icon:"mouse-pointer-click",

            className:"info",

            growth: previousTotal ? getGrowthValue(total.clicks, "clicks") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        },

        {

            title:"CTR",

            value:`${Number(total.ctr).toFixed(2)}%`,

            icon:"percent",

            className:"warning",

            growth: previousTotal ? getGrowthValue(total.ctr, "ctr") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        },

        {

            title:"Units Sold",

            value:Number(total.units)

                .toLocaleString("en-IN"),

            icon:"shopping-cart",

            className:"success",

            growth: previousTotal ? getGrowthValue(total.units, "units") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        },

        {

            title:"Revenue",

            value:Math.round(

                Number(total.revenue)

            ).toLocaleString("en-IN"),

            prefix:"₹",

            icon:"indian-rupee",

            className:"success",

            growth: previousTotal ? getGrowthValue(total.revenue, "revenue") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        },

        {

            title:"Spend",

            value:Math.round(

                Number(total.spend)

            ).toLocaleString("en-IN"),

            prefix:"₹",

            icon:"wallet",

            className:"danger",

            growth: previousTotal ? getGrowthValue(total.spend, "spend") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "negative"

        },

        {

            title:"ROI",

            value:Number(total.roi)

                .toFixed(2),

            icon:"trending-up",

            className:"primary",

            growth: previousTotal ? getGrowthValue(total.roi, "roi") : undefined,

            compareLabel: previousTotal ? compareLabel : undefined,

            growthType: "positive"

        }

    ];

}