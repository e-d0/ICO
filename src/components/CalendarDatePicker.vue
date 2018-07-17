<template >
  <div class="datepicker" v-if="show">
    <v-date-picker
      mode='range'
      v-model='selectedDate'
      tint-color="#7dc773"
      show-caps
      @input="datesEmit"
      :show-day-popover='false'
      titlePosition="left"
      :select-attribute='attrs'
      :drag-attribute='dragAttrs'
      :theme-styles="themeStyles"
      :formats='formats'
      is-inline>
      <span slot='header-title' slot-scope='{ monthLabel, yearLabel }'>
    {{ monthLabel }} <small>&#8226;</small> {{ yearLabel }}
  </span>
    </v-date-picker>
  </div>
</template>

<script>
import { createDays } from './eventbus'
/**
 * DOCS https://vcalendardocs.netlify.com/#calendar
 * */
export default {
  name: 'CalendarDatePicker',
  props: {
  },
  data () {
    return {
      self: this,
      show: true,
      themeStyles: {
        wrapper: {
          minWidth: '284px',
          maxWidth: '284px',
          backgroundColor: '#fafbfc'
        },
        headerTitle: {
          fontWeight: '500',
          textTransform: 'capitalize',
          fontSize: '16px',
          fontFamily: 'Roboto Medium'
        },
        headerArrows: {
          color: '#b5bbc2',
          fontSize: '18px'
        },
        header: {
          borderColor: '#404c59',
          borderWidth: '0 0 1px 0',
          // padding: '12px 20px 12px 24px',
          padding: '0px 22px 0px 24px',
          minHeight: '51px'
        },
        headerHorizontalDivider: {
          borderTop: '1px solid #e0e6ed',
          width: '100%'
        },
        weeks: {
          borderRadius: '4px',
          // padding: '0px 16px',
          padding: '0px',
          paddingBottom: '16px',
          fontFamily: 'Roboto Medium',
          backgroundColor: '#fafbfc'
        },
        weekdays: {
          borderWidth: '0 1px',
          fontFamily: 'Roboto Medium',
          padding: '16px 0px 8px',
          // paddingBottom: '8px',
          backgroundColor: '#fafbfc',
          maxHeight: '51px',
          fontSize: '14px'
        },
        dayCellNotInMonth: {
          color: 'rgb(225, 228, 231)'
        },
        // dayContent: params => (console.log(params)),
        dayContent: params => ({
          ...(params.isHovered && {
            backgroundColor: '#7dc773',
            color: '#fff',
            maxHeight: '27px',
            maxWidth: '27px'
          })
          // ...(params.day.weekday === 1 && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   right: '13px'
          // }),
          // ...(params.day.weekday === 2 && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   left: '13px'
          // }),
          // ...((params.day.weekday === 3) && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   left: '8px'
          // }),
          // ...((params.day.weekday === (4)) && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   left: '6px'
          // }),
          // ...((params.day.weekday === 6) && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   right: '6px'
          // }),
          // ...((params.day.weekday === 7) && {
          //   maxWidth: '27px',
          //   minWidth: '27px',
          //   position: 'relative',
          //   right: '8px'
          // }),
          // ...({
          //   // maxHeight: '27px',
          //   // lineHeight: '27px',
          //   // maxWidth: '27px'
          // })
        }),
        dayCell: {
          maxHeight: '27px'
        }
      },
      attrs:
        {
          highlight: {
            backgroundColor: '#e8edf1',
            height: '27px',
            borderRadius: '27px'
          },
          contentStyle: params => (
            {
              ...(params.day && {
                color: '#000'
              }),
              ...(!params.inBetween && {
                color: '#fff'
              }),
              ...(params.isFocused && {
                height: '10px'
              }),
              ...(params.onEnd && {
                color: this.dynamicEndFontStyle(params)
              })
            }
          ),
          // highlightCaps: params => (console.log(params)),
          highlightCaps: params => ({
            ...(params.onStart && {
              backgroundColor: '#7dc773',
              color: '#fff',
              border: '1px solid #C71900',
              height: '27px'
            }),
            ...(params.onEnd && {
              backgroundColor: this.dynamicEndCapStyle(params),
              border: 'none',
              color: this.dynamicEndFontStyle(params),
              height: '27px'
            })
          })
        },
      dragAttrs:
        {
          highlight: {
            backgroundColor: '#e8edf1',
            height: '27px',
            borderRadius: '17px'
          },
          highlightCaps: params => ({
            ...(params.onStart && {
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#7DC773',
              borderWidth: '1px',
              borderStyle: 'solid',
              height: '27px'
            }),
            ...(params.onEnd && {
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#7DC773',
              borderWidth: '1px',
              borderStyle: 'solid',
              height: '27px'
            })
          })
        },
      formats: {
        title: `MMMM YYYY`
      },
      selectedDate: {
        start: this.$moment().startOf('day').toDate(),
        end: this.$moment().startOf('day').add(6, 'days').toDate()
      }
    }
  },
  methods: {
    dynamicEndCapStyle (params) {
      if (params.targetDate.daySpan === 0) {
        return '#7dc773'
      } else { return '#e8edf1' }
    },
    dynamicEndFontStyle (params) {
      if (params.targetDate.daySpan === 0) {
        return '#fff'
      } else { return '#000' }
    },
    datesEmit (e) {
      /**
       * Готовим и отправляем  событие массив выбранных дней
       * */
      const generatedDays = createDays(e.start, e.end)
      this.$store.dispatch({
        type: 'event/setDates',
        data: generatedDays
      })
      // console.log(generatedDays, 'schedular caletndar emitted dates array')
    }
  },
  created () {
  },
  mounted () {
    /**
     * Создаем массив дней в зависимости от принятых дат
     * и передаем в глобальное событие
     */
    this.datesEmit(this.selectedDate)
  },
  computed: {
  }
}
</script>
<style lang="less" scoped>
  .datepicker{
    border-top: 4px solid #c5d0de;
    -webkit-box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
    border-radius: 4px;
    background-color: #ffffff;
    margin-bottom: 32px;
    min-width: 284px;
    max-width: 284px;
  }
</style>
