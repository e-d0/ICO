<template >
  <div class="datepicker">
    <v-date-picker
      mode='range'
      v-model='selectedDate'
      tint-color="#7dc773"
      show-caps
      @input="datesEmit"
      :show-day-popover='false'
      titlePosition="left"
      :select-attribute='attrs'
      :theme-styles="themeStyles"
      :formats='formats'
      is-inline>
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
      themeStyles: {
        wrapper: {
          width: '100%'
        },
        headerTitle: {
          fontWeight: 'bold',
          textTransform: 'capitalize',
          fontSize: '16px'
        },
        headerArrows: {
          color: '#b5bbc2',
          fontSize: '18px'
        },
        header: {
          borderColor: '#404c59',
          borderWidth: '0 0 1px 0',
          padding: '12px 16px 12px 20px'
        },
        headerHorizontalDivider: {
          borderTop: '1px solid #e0e6ed',
          width: '100%'
        },
        weekdays: {
          borderWidth: '0 1px',
          padding: '14px 10px 0 10px'
        },
        dayContent: params => ({
          ...(params.isHovered && {
            backgroundColor: '#7dc773',
            color: '#fff'
          })
        }),
        weeks: {
          backgroundColor: '#ffffff',
          borderRadius: '4px',
          padding: '8px 12px 12px 12px'
        }
      },
      attrs:
        {
          highlight: {
            backgroundColor: '#e8edf1'
          },
          contentStyle: params => ({
            ...(params.day && {
              color: '#000'
            }),
            ...(!params.inBetween && {
              color: '#fff'
            })
          }),
          highlightCaps: {
            backgroundColor: '#7dc773'
          }
        },
      formats: {
        title: 'MMMM YYYY'
      },
      selectedDate: {
        start: this.$moment().startOf('day').toDate(),
        end: this.$moment().endOf('week').toDate()
      }
    }
  },
  methods: {
    datesEmit (e) {
      /**
       * Готовим и отправляем  событие массив выбранных дней
       * */
      const generatedDays = createDays(e.start, e.end)
      this.$store.dispatch({
        type: 'event/setDates',
        data: generatedDays
      })
      console.log(generatedDays, 'schedular caletndar emitted dates array')
    }
  },
  created () {
  },
  mounted () {
    /**
     * Создаем массив дней в зависимости от принятых дат
     * и передаем в глобальное событие
     */
    console.log('el calendar is created')
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
  }
</style>
