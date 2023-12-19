FUNCTION render_plugin(p_dynamic_action IN apex_plugin.t_dynamic_action,
                               p_plugin         IN apex_plugin.t_plugin)
  RETURN apex_plugin.t_dynamic_action_render_result IS
    --custom plugin attributes
    l_result                                apex_plugin.t_dynamic_action_render_result;
    --
    attr_date_from                          p_dynamic_action.attribute_01%TYPE := p_dynamic_action.attribute_01;
    attr_date_to                            p_dynamic_action.attribute_02%TYPE := p_dynamic_action.attribute_02;
    attr_must_select_date_from              p_dynamic_action.attribute_05%TYPE := p_dynamic_action.attribute_05;
    attr_must_select_date_to                p_dynamic_action.attribute_04%TYPE := p_dynamic_action.attribute_04;
    attr_greather_than_date                 p_dynamic_action.attribute_06%TYPE := p_dynamic_action.attribute_06;
    attr_earlier_than_date                  p_dynamic_action.attribute_07%TYPE := p_dynamic_action.attribute_07;
    --
BEGIN
    --debug
    if apex_application.g_debug then
        apex_plugin_util.debug_dynamic_action(p_plugin => p_plugin, p_dynamic_action => p_dynamic_action);
    end if;
    --
    l_result.javascript_function := 'datesValidator.initialize("'||attr_date_from||'", "'||attr_date_to||'", "'||attr_must_select_date_from||'", "'||attr_must_select_date_to||'", "'||attr_greather_than_date||'", "'||attr_earlier_than_date||'")';
    l_result.ajax_identifier     := apex_plugin.get_ajax_identifier;
    --
    return l_result;
    --
end render_plugin;