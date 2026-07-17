/**
 * =====================================================
 * Project Phoenix
 * Product : Myntra Analytics
 * Module  : Refresh Dashboard
 * Version : V12.7
 * =====================================================
 */

import { SalesReturnStore } from "../store/salesReturnStore.js";

import { filterData } from "../engines/filterData.js";

import { buildLookup } from "../engines/buildLookup.js";

import { buildKPIs } from "../engines/buildKPIs.js";

import { buildPOTypeReport } from "../builders/buildPOTypeReport.js";
import { buildBrandReport } from "../builders/buildBrandReport.js";
import { buildStyleReport } from "../builders/buildStyleReport.js";
import { buildReturnReasonReport } from "../builders/buildReturnReasonReport.js";
import { buildTrendReport } from "../builders/buildTrendReport.js";

import { renderKPIs } from "../renderers/renderKPIs.js";

import { renderPOTypeReport } from "../renderers/renderPOTypeReport.js";
import { renderBrandReport } from "../renderers/renderBrandReport.js";
import { renderStyleReport } from "../renderers/renderStyleReport.js";
import { renderReturnReasonReport } from "../renderers/renderReturnReasonReport.js";
import { renderTrendReport } from "../renderers/renderTrendReport.js";

import { FilterState } from "../../../services/filterService.js";
import { getPreviousPeriod } from "../../../services/comparisonService.js";

/**
 * =====================================================
 * Refresh Dashboard
 * =====================================================
 */

export async function refreshDashboard(){

    SalesReturnStore.loading = true;

    /**
     * ==========================================
     * Reset
     * ==========================================
     */

    SalesReturnStore.sales = [];

    SalesReturnStore.returns = [];

    SalesReturnStore.lookup = {};

    SalesReturnStore.dashboard = {

        sale:{gmv:0,units:0},

        cancel:{gmv:0,units:0},

        rto:{gmv:0,units:0},

        cx:{gmv:0,units:0},

        net:{gmv:0,units:0}

    };

    SalesReturnStore.reports = {

        poType:[],

        brand:[],

        style:[],

        returnReason:[],

        trend:[]

    };

    /**
     * ==========================================
     * Apply Global Filters
     * ==========================================
     */

    const {

        sales,

        returns

    } = filterData();

    SalesReturnStore.sales = sales;

    SalesReturnStore.returns = returns;

    /**
     * ==========================================
     * Build Lookup
     * ==========================================
     */

    SalesReturnStore.lookup = buildLookup(

        SalesReturnStore.sales

    );

    /**
     * ==========================================
     * KPI
     * ==========================================
     */

    const previousPeriod = getPreviousPeriod(FilterState.period);
    let previousKPIs = null;
    let compareLabel = "Previous Period";

    if (previousPeriod) {
        const prevData = filterData(previousPeriod);
        const prevLookup = buildLookup(prevData.sales);
        previousKPIs = buildKPIs(
            prevData.sales,
            prevData.returns,
            prevLookup
        );
        const year = Math.floor(previousPeriod / 100);
        const month = previousPeriod % 100;
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
        compareLabel = `${months[month - 1] || ""} ${year}`;
    }

    SalesReturnStore.dashboard = buildKPIs(

        SalesReturnStore.sales,

        SalesReturnStore.returns,

        SalesReturnStore.lookup,

        previousKPIs,

        compareLabel

    );

    /**
     * ==========================================
     * Reports
     * ==========================================
     */

    SalesReturnStore.reports.poType =

        buildPOTypeReport(

            SalesReturnStore.sales,

            SalesReturnStore.returns,

            SalesReturnStore.lookup

        );

    SalesReturnStore.reports.brand =

        buildBrandReport(

            SalesReturnStore.sales,

            SalesReturnStore.returns,

            SalesReturnStore.lookup

        );

    SalesReturnStore.reports.style =

        buildStyleReport(

            SalesReturnStore.sales,

            SalesReturnStore.returns,

            SalesReturnStore.lookup

        );

    SalesReturnStore.reports.returnReason =

        buildReturnReasonReport(

            SalesReturnStore.sales,

            SalesReturnStore.returns,

            SalesReturnStore.lookup

        );

    SalesReturnStore.reports.trend =

        buildTrendReport(

            SalesReturnStore.sales,

            SalesReturnStore.returns,

            SalesReturnStore.lookup

        );

    /**
     * ==========================================
     * Render KPI
     * ==========================================
     */

    const kpiContainer = document.getElementById("salesReturnKPIs");

    if(kpiContainer){

        await renderKPIs(

            kpiContainer,

            SalesReturnStore.dashboard

        );

    }

    /**
     * ==========================================
     * Render PO Type
     * ==========================================
     */

    const poContainer = document.getElementById("salesReturnPOType");

    if(poContainer){

        await renderPOTypeReport(

            poContainer,

            SalesReturnStore.reports.poType

        );

    }

    /**
     * ==========================================
     * Render Brand
     * ==========================================
     */

    const brandContainer = document.getElementById("salesReturnBrand");

    if(brandContainer){

        await renderBrandReport(

            brandContainer,

            SalesReturnStore.reports.brand

        );

    }

    /**
     * ==========================================
     * Render Style
     * ==========================================
     */

    const styleContainer = document.getElementById("salesReturnStyle");

    if(styleContainer){

        await renderStyleReport(

            styleContainer,

            SalesReturnStore.reports.style

        );

    }

    /**
     * ==========================================
     * Render Return Reason
     * ==========================================
     */

    const reasonContainer = document.getElementById("salesReturnReason");

    if(reasonContainer){

        await renderReturnReasonReport(

            reasonContainer,

            SalesReturnStore.reports.returnReason

        );

    }

    /**
     * ==========================================
     * Render Trend
     * ==========================================
     */

    const trendContainer = document.getElementById("salesReturnTrend");

    if(trendContainer){

        await renderTrendReport(

            trendContainer,

            SalesReturnStore.reports.trend

        );

    }

    /**
     * ==========================================
     * Status
     * ==========================================
     */

    SalesReturnStore.loading = false;

    SalesReturnStore.loaded = true;

    SalesReturnStore.generatedOn = new Date();

    SalesReturnStore.ui.lastRefresh = new Date();

    /**
     * ==========================================
     * Debug
     * ==========================================
     */

    console.group("Sales & Return");

    console.log("Sales Rows:", SalesReturnStore.sales.length);

    console.log("Return Rows:", SalesReturnStore.returns.length);

    console.log("Lookup:", Object.keys(SalesReturnStore.lookup).length);

    console.log("PO Types:", SalesReturnStore.reports.poType.length);

    console.log("Brands:", SalesReturnStore.reports.brand.length);

    console.log("Styles:", SalesReturnStore.reports.style.length);

    console.log("Return Reasons:", SalesReturnStore.reports.returnReason.length);

    console.log("Trend Periods:", SalesReturnStore.reports.trend.length);

    console.groupEnd();

}

